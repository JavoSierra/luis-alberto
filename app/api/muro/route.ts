// Ruta del muro: /api/muro
// GET  → publicaciones aprobadas y vigentes (lo que ve todo el mundo)
// POST → nueva publicación (entra "pendiente" hasta que el dueño la apruebe)

import { baseDeDatos, desdeLaPagina, hashIp, ipDe, muroActivo } from "@/lib/muro/servidor";
import { dominio, limpiarComentario, MAX_COMENTARIO, urlValida, type Publicacion } from "@/lib/muro/validar";

export const dynamic = "force-dynamic";

const LIMITE_POR_HORA = 3;
const LIMITE_POR_DIA = 10;
const REPORTES_PARA_OCULTAR = 3;
const MAX_PENDIENTES = 200;
const MAX_CUERPO = 2_000; // bytes: un link + comentario nunca ocupan más
const CAMPOS = "id, url, dominio, comentario, creado";

function json(datos: unknown, estado = 200, cacheSegundos = 0) {
  return Response.json(datos, {
    status: estado,
    headers: cacheSegundos
      ? { "Cache-Control": `public, s-maxage=${cacheSegundos}, stale-while-revalidate=300` }
      : { "Cache-Control": "no-store" },
  });
}

export async function GET() {
  if (!muroActivo()) return json({ activo: false, publicaciones: [] });

  const { data, error } = await baseDeDatos()
    .from("publicaciones")
    .select(CAMPOS)
    .eq("estado", "aprobada")
    .gt("vence", new Date().toISOString())
    .lt("reportes", REPORTES_PARA_OCULTAR)
    .order("creado", { ascending: false })
    .limit(30);

  if (error) {
    console.error("Muro: error al leer", error);
    return json({ activo: true, publicaciones: [], error: true }, 500);
  }
  // Se guarda 1 minuto en la red de Vercel: una aprobación nueva aparece enseguida
  return json({ activo: true, publicaciones: (data as Publicacion[]).reverse() }, 200, 60);
}

export async function POST(request: Request) {
  if (!muroActivo()) return json({ error: "El muro todavía no está activo." }, 503);
  if (!desdeLaPagina(request)) return json({ error: "Pedido no permitido." }, 403);

  let cuerpo: { url?: unknown; comentario?: unknown; sitio?: unknown };
  try {
    // Se rechazan pedidos gigantes antes de leerlos
    const texto = await request.text();
    if (texto.length > MAX_CUERPO) return json({ error: "Pedido inválido." }, 413);
    cuerpo = JSON.parse(texto);
    if (typeof cuerpo !== "object" || cuerpo === null) throw new Error("no es un objeto");
  } catch {
    return json({ error: "Pedido inválido." }, 400);
  }

  // Campo trampa (honeypot): es invisible para las personas. Si viene completo, es un robot.
  // Le respondemos "ok" para que no se dé cuenta, pero no guardamos nada.
  if (typeof cuerpo.sitio === "string" && cuerpo.sitio.trim() !== "") {
    return json({ ok: true, publicacion: null });
  }

  const url = typeof cuerpo.url === "string" ? urlValida(cuerpo.url) : null;
  if (!url) return json({ error: "Pegá un link completo que empiece con https://" }, 400);

  const comentario = typeof cuerpo.comentario === "string" ? limpiarComentario(cuerpo.comentario) : "";
  if (comentario.length > MAX_COMENTARIO) {
    return json({ error: `El comentario puede tener hasta ${MAX_COMENTARIO} caracteres.` }, 400);
  }

  const db = baseDeDatos();
  const ipHash = hashIp(ipDe(request));

  // Freno general contra ataques de spam desde muchas conexiones: si ya hay demasiadas
  // publicaciones esperando revisión, no se aceptan nuevas hasta que el dueño revise.
  const { count: pendientes, error: errorPendientes } = await db
    .from("publicaciones")
    .select("id", { count: "exact", head: true })
    .eq("estado", "pendiente");
  if (errorPendientes) {
    console.error("Muro: error al contar pendientes", errorPendientes);
    return json({ error: "No pudimos guardar tu oferta. Probá de nuevo en un rato." }, 500);
  }
  if ((pendientes ?? 0) >= MAX_PENDIENTES) {
    return json({ error: "Hay muchas ofertas esperando revisión. Probá de nuevo más tarde." }, 503);
  }

  // Límite de envíos por persona (IP hasheada)
  const haceUnDia = new Date(Date.now() - 86_400_000).toISOString();
  const { data: recientes, error: errorConteo } = await db
    .from("publicaciones")
    .select("creado")
    .eq("ip_hash", ipHash)
    .gt("creado", haceUnDia);
  if (errorConteo) {
    console.error("Muro: error al contar envíos", errorConteo);
    return json({ error: "No pudimos guardar tu oferta. Probá de nuevo en un rato." }, 500);
  }
  const haceUnaHora = Date.now() - 3_600_000;
  const enLaHora = (recientes ?? []).filter((r) => new Date(r.creado).getTime() > haceUnaHora).length;
  if (enLaHora >= LIMITE_POR_HORA || (recientes ?? []).length >= LIMITE_POR_DIA) {
    return json({ error: "Ya compartiste varias ofertas. ¡Gracias! Probá de nuevo en un rato." }, 429);
  }

  const { data, error } = await db
    .from("publicaciones")
    .insert({ url, dominio: dominio(url), comentario: comentario || null, ip_hash: ipHash })
    .select(CAMPOS)
    .single();
  if (error) {
    console.error("Muro: error al guardar", error);
    return json({ error: "No pudimos guardar tu oferta. Probá de nuevo en un rato." }, 500);
  }

  // Limpieza: borra las publicaciones vencidas (más de 30 días)
  await db.from("publicaciones").delete().lt("vence", new Date().toISOString());

  return json({ ok: true, publicacion: data as Publicacion }, 201);
}
