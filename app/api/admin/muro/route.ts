// Rutas del panel para moderar el muro: /api/admin/muro
// GET  ?estado=pendiente|aprobada|rechazada|reportadas → lista + cantidades
// POST { id, accion: "aprobar" | "rechazar" | "borrar" | "limpiar-reportes" }
// Solo responden en las direcciones privadas de Vercel (ver lib/admin.ts).

import { pedidoDelPanel } from "@/lib/admin";
import { baseDeDatos, muroActivo } from "@/lib/muro/servidor";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CAMPOS = "id, url, dominio, comentario, estado, reportes, creado, vence";

function json(datos: unknown, estado = 200) {
  return Response.json(datos, { status: estado, headers: { "Cache-Control": "no-store" } });
}

// Cuenta publicaciones (sin traerlas)
const cuenta = () => baseDeDatos().from("publicaciones").select("id", { count: "exact", head: true });

export async function GET(request: Request) {
  if (!pedidoDelPanel(request)) return json({ error: "No encontrado" }, 404);
  if (!muroActivo()) return json({ activo: false });

  const estado = new URL(request.url).searchParams.get("estado") ?? "pendiente";
  let consulta = baseDeDatos().from("publicaciones").select(CAMPOS).order("creado", { ascending: false }).limit(100);
  if (estado === "reportadas") consulta = consulta.gt("reportes", 0);
  else if (["pendiente", "aprobada", "rechazada"].includes(estado)) consulta = consulta.eq("estado", estado);

  const [{ data, error }, pendientes, aprobadas, rechazadas, reportadas] = await Promise.all([
    consulta,
    cuenta().eq("estado", "pendiente"),
    cuenta().eq("estado", "aprobada"),
    cuenta().eq("estado", "rechazada"),
    cuenta().gt("reportes", 0),
  ]);
  if (error) {
    console.error("Panel: error al leer", error);
    return json({ error: "No se pudo leer la base de datos." }, 500);
  }
  return json({
    activo: true,
    publicaciones: data,
    cantidades: {
      pendientes: pendientes.count ?? 0,
      aprobadas: aprobadas.count ?? 0,
      rechazadas: rechazadas.count ?? 0,
      reportadas: reportadas.count ?? 0,
    },
  });
}

export async function POST(request: Request) {
  if (!pedidoDelPanel(request)) return json({ error: "No encontrado" }, 404);
  if (!muroActivo()) return json({ error: "El muro no está activo." }, 503);

  let id: unknown, accion: unknown;
  try {
    ({ id, accion } = await request.json());
  } catch {
    return json({ error: "Pedido inválido." }, 400);
  }
  if (typeof id !== "string" || !UUID.test(id)) return json({ error: "Pedido inválido." }, 400);

  const tabla = baseDeDatos().from("publicaciones");
  let resultado;
  if (accion === "aprobar") resultado = await tabla.update({ estado: "aprobada" }).eq("id", id);
  else if (accion === "rechazar") resultado = await tabla.update({ estado: "rechazada" }).eq("id", id);
  else if (accion === "limpiar-reportes") {
    await baseDeDatos().from("reportes").delete().eq("publicacion_id", id);
    resultado = await tabla.update({ reportes: 0 }).eq("id", id);
  } else if (accion === "borrar") resultado = await tabla.delete().eq("id", id);
  else return json({ error: "Acción desconocida." }, 400);

  if (resultado.error) {
    console.error("Panel: error en la acción", accion, resultado.error);
    return json({ error: "No se pudo guardar el cambio." }, 500);
  }
  return json({ ok: true });
}
