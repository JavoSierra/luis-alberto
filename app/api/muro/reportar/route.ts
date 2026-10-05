// Ruta para reportar una publicación del muro: /api/muro/reportar
// Cada persona (IP hasheada) cuenta una sola vez por publicación.
// Con 3 reportes, la publicación se oculta hasta que el dueño la revise en Supabase.

import { baseDeDatos, hashIp, ipDe, muroActivo } from "@/lib/muro/servidor";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  if (!muroActivo()) return Response.json({ error: "El muro todavía no está activo." }, { status: 503 });

  let id: unknown;
  try {
    ({ id } = await request.json());
  } catch {
    return Response.json({ error: "Pedido inválido." }, { status: 400 });
  }
  if (typeof id !== "string" || !UUID.test(id)) {
    return Response.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const { error } = await baseDeDatos().rpc("reportar_publicacion", { pid: id, hash: hashIp(ipDe(request)) });
  if (error) {
    console.error("Muro: error al reportar", error);
    return Response.json({ error: "No pudimos enviar el reporte." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
