// Ruta del servidor que entrega las ofertas a la página: /api/empleos
// Las fuentes se consultan desde acá (nunca desde el navegador) y el resultado se guarda 6 horas.
// Así respetamos los límites de cada fuente: Jobicy pide no más de una consulta por hora
// y Himalayas se actualiza una vez por día.

import { obtenerEmpleos } from "@/lib/empleos";
import type { RespuestaEmpleos } from "@/lib/empleos/tipos";

// En Vercel: la respuesta se guarda y se renueva cada 6 horas (21.600 segundos)
export const revalidate = 21600;

const SEIS_HORAS_MS = 21_600_000;

// Copia en memoria, para no consultar a las fuentes en cada recarga mientras se prueba en la compu.
// Se guarda en globalThis para que sobreviva cuando el código se recarga al editarlo.
type Copia = { datos: RespuestaEmpleos; hasta: number };
const memoria = globalThis as typeof globalThis & { __copiaEmpleos?: Copia };

export async function GET() {
  const copia = memoria.__copiaEmpleos;
  if (copia && Date.now() < copia.hasta) return Response.json(copia.datos);

  const datos = await obtenerEmpleos();
  // Si todas las fuentes fallaron, no guardamos el resultado vacío por 6 horas: se reintenta en 10 minutos
  const duracion = datos.ofertas.length ? SEIS_HORAS_MS : 600_000;
  memoria.__copiaEmpleos = { datos, hasta: Date.now() + duracion };
  return Response.json(datos);
}
