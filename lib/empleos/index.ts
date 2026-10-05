// Junta las ofertas de todas las fuentes, saca duplicados y las ordena.
// Solo se usa en el servidor (desde app/api/empleos/route.ts).

import { traerGetOnBoard } from "./fuentes/getonboard";
import { traerHimalayas } from "./fuentes/himalayas";
import { traerJobicy } from "./fuentes/jobicy";
import { normalizar } from "./region";
import type { Oferta, Region, RespuestaEmpleos } from "./tipos";

const FUENTES: { nombre: string; traer: () => Promise<Oferta[]> }[] = [
  { nombre: "Get on Board", traer: traerGetOnBoard },
  { nombre: "Himalayas", traer: traerHimalayas },
  { nombre: "Jobicy", traer: traerJobicy },
];

const DIAS_MAXIMOS = 30; // ofertas más viejas no se muestran
const DIA_MS = 86_400_000;

// Orden: primero Argentina, después LATAM, después Global (y Otras al final),
// combinado con la fecha: días de antigüedad + 2 por cada escalón de región.
const ESCALON: Record<Region, number> = { Argentina: 0, LATAM: 1, Global: 2, Otras: 3 };

function puntaje(o: Oferta, ahora: number): number {
  const dias = (ahora - new Date(o.fecha).getTime()) / DIA_MS;
  return dias + ESCALON[o.region] * 2;
}

// Dos ofertas son la misma si coinciden puesto y empresa (aunque vengan de fuentes distintas)
function clave(o: Oferta): string {
  return `${normalizar(o.titulo)}|${normalizar(o.empresa)}`;
}

export async function obtenerEmpleos(): Promise<RespuestaEmpleos> {
  const resultados = await Promise.allSettled(FUENTES.map((f) => f.traer()));

  const fuentesConError: string[] = [];
  const todas: Oferta[] = [];
  resultados.forEach((r, i) => {
    if (r.status === "fulfilled") todas.push(...r.value);
    else {
      fuentesConError.push(FUENTES[i].nombre);
      console.error(`Fuente caída: ${FUENTES[i].nombre}`, r.reason);
    }
  });

  const ahora = Date.now();
  const vistas = new Set<string>();
  const ofertas = todas
    .filter((o) => o.titulo && o.link.startsWith("https://"))
    .filter((o) => ahora - new Date(o.fecha).getTime() <= DIAS_MAXIMOS * DIA_MS)
    .filter((o) => {
      const k = clave(o);
      if (vistas.has(k)) return false;
      vistas.add(k);
      return true;
    })
    .sort((a, b) => puntaje(a, ahora) - puntaje(b, ahora));

  return { ofertas, fuentesConError, actualizado: new Date(ahora).toISOString() };
}
