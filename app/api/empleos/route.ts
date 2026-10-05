// Ruta del servidor que entrega las ofertas a la página: /api/empleos
// Las fuentes se consultan desde acá (nunca desde el navegador) y el resultado se guarda 6 horas.
// Así respetamos los límites de cada fuente: Jobicy pide no más de una consulta por hora
// y Himalayas se actualiza una vez por día.
//
// Dónde se guarda:
// 1. En Vercel, la red de Vercel guarda la respuesta 6 horas (encabezado Cache-Control con s-maxage).
// 2. En memoria del servidor, por si la misma copia del servidor recibe otra visita.
// La ruta no se arma al construir la página (force-dynamic): así cada publicación nueva
// no consulta a las fuentes, y un error de una fuente no queda guardado por horas.

import { obtenerEmpleos } from "@/lib/empleos";
import type { RespuestaEmpleos } from "@/lib/empleos/tipos";

export const dynamic = "force-dynamic";

const SEIS_HORAS_S = 21_600;
const DIEZ_MINUTOS_S = 600;

type Copia = { datos: RespuestaEmpleos; hasta: number };
// Se guarda en globalThis para que sobreviva cuando el código se recarga al editarlo en la compu
const memoria = globalThis as typeof globalThis & { __copiaEmpleos?: Copia };

function responder(datos: RespuestaEmpleos, segundos: number) {
  return Response.json(datos, {
    headers: {
      // Si alguna fuente falló, se guarda solo 10 minutos para reintentar pronto
      "Cache-Control": `public, s-maxage=${segundos}, stale-while-revalidate=3600`,
    },
  });
}

export async function GET() {
  const copia = memoria.__copiaEmpleos;
  if (copia && Date.now() < copia.hasta) {
    return responder(copia.datos, Math.max(60, Math.round((copia.hasta - Date.now()) / 1000)));
  }

  const datos = await obtenerEmpleos();
  const segundos = datos.fuentesConError.length ? DIEZ_MINUTOS_S : SEIS_HORAS_S;
  memoria.__copiaEmpleos = { datos, hasta: Date.now() + segundos * 1000 };
  return responder(datos, segundos);
}
