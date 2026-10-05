// Fuente: Jobicy (https://jobicy.com) — empleos remotos.
// Condiciones (verificadas 5/10/2026): sin clave; no consultar más de una vez por hora;
// mencionar a Jobicy con link directo y que el botón lleve a la URL original del aviso.
// Usamos los filtros geo=argentina y geo=latam (existen en ?get=locations).

import { unificarCategoria } from "../categorias";
import { pedirJson } from "../pedir";
import { regionRemota, ubicacionRemota } from "../region";
import { detectarIdioma, limpiarTitulo, sinHtml, unificarJornada } from "../texto";
import type { Oferta } from "../tipos";

type AvisoJobicy = {
  id: number;
  url: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  jobIndustry?: string[];
  jobType?: string[];
  jobGeo?: string;
  jobExcerpt?: string;
  pubDate: string;
};

const BASE = "https://jobicy.com/api/v2/remote-jobs";

function convertir(a: AvisoJobicy): Oferta {
  // jobGeo viene como "EMEA,  LATAM,  USA" o "Anywhere"
  const lugares = (a.jobGeo ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const region = regionRemota(lugares);
  const titulo = limpiarTitulo(a.jobTitle);
  return {
    id: `jobicy-${a.id}`,
    titulo,
    empresa: limpiarTitulo(a.companyName),
    logo: a.companyLogo || null,
    ubicacion: ubicacionRemota(region, lugares),
    region,
    jornada: unificarJornada(a.jobType?.[0]),
    modalidad: "Remoto",
    idioma: detectarIdioma(titulo, sinHtml(a.jobExcerpt)),
    categoria: unificarCategoria(...(a.jobIndustry ?? []), titulo),
    fecha: new Date(a.pubDate).toISOString(),
    link: a.url,
    fuente: "Jobicy",
    fuenteUrl: "https://jobicy.com",
  };
}

export async function traerJobicy(): Promise<Oferta[]> {
  const [ar, latam] = await Promise.all([
    pedirJson<{ jobs?: AvisoJobicy[] }>(`${BASE}?count=100&geo=argentina`),
    pedirJson<{ jobs?: AvisoJobicy[] }>(`${BASE}?count=100&geo=latam`),
  ]);
  return [...(ar.jobs ?? []), ...(latam.jobs ?? [])].map(convertir);
}
