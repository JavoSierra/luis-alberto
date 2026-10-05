// Fuente: Himalayas (https://himalayas.app) — empleos remotos.
// Condiciones (verificadas 5/10/2026): sin clave; link visible a himalayas.app y mención de la fuente.
// Los datos se actualizan una vez por día. El filtro country=Argentina trae ofertas abiertas a Argentina
// y también ofertas para todo el mundo: la región la calculamos con locationRestrictions.

import { unificarCategoria } from "../categorias";
import { pedirJson } from "../pedir";
import { regionRemota, ubicacionRemota } from "../region";
import { detectarIdioma, fechaUnix, limpiarTitulo, sinHtml, unificarJornada } from "../texto";
import type { Oferta } from "../tipos";

type AvisoHimalayas = {
  guid: string;
  title: string;
  excerpt?: string;
  companyName: string;
  companyLogo?: string;
  employmentType?: string;
  locationRestrictions?: (string | { name?: string })[];
  categories?: string[];
  parentCategories?: string[];
  pubDate: number;
  applicationLink: string;
};

const BASE = "https://himalayas.app/jobs/api/search?country=Argentina&sort=recent";
const PAGINAS = 3; // 20 ofertas por página

function convertir(a: AvisoHimalayas): Oferta {
  const lugares = (a.locationRestrictions ?? []).map((l) => (typeof l === "string" ? l : l.name ?? ""));
  const region = regionRemota(lugares);
  const titulo = limpiarTitulo(a.title);
  return {
    id: `himalayas-${a.guid.split("/").pop()}`,
    titulo,
    empresa: limpiarTitulo(a.companyName),
    logo: a.companyLogo || null,
    ubicacion: ubicacionRemota(region, lugares),
    region,
    jornada: unificarJornada(a.employmentType),
    modalidad: "Remoto",
    idioma: detectarIdioma(titulo, sinHtml(a.excerpt)),
    categoria: unificarCategoria(...(a.parentCategories ?? []), ...(a.categories ?? []).slice(0, 2), titulo),
    fecha: fechaUnix(a.pubDate),
    link: a.applicationLink,
    fuente: "Himalayas",
    fuenteUrl: "https://himalayas.app",
  };
}

export async function traerHimalayas(): Promise<Oferta[]> {
  const avisos: AvisoHimalayas[] = [];
  // De a una página por vez, para no saturar a la fuente
  for (let pagina = 1; pagina <= PAGINAS; pagina++) {
    const datos = await pedirJson<{ jobs?: AvisoHimalayas[] }>(`${BASE}&page=${pagina}`);
    avisos.push(...(datos.jobs ?? []));
    if (!datos.jobs?.length) break;
  }
  return avisos.map(convertir);
}
