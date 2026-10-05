// Fuente: Get on Board (https://www.getonbrd.com) — empleos de LATAM, sobre todo tecnología y digital.
// API pública sin clave. Su documentación no publica límites ni reglas de atribución (verificado 5/10/2026);
// igual mencionamos la fuente con link y mandamos a la publicación original.
// No hay un filtro por país documentado: traemos las ofertas recientes de cada categoría y
// calculamos la región con los datos de ubicación de cada aviso.

import { unificarCategoria } from "../categorias";
import { pedirJson } from "../pedir";
import { nombrePais, regionPresencial, regionRemota, ubicacionRemota } from "../region";
import { detectarIdioma, fechaUnix, limpiarTitulo, sinHtml, unificarJornada } from "../texto";
import type { Modalidad, Oferta, Region } from "../tipos";

type Relacion<A> = { data: { id: string; attributes?: A } | { id: string; attributes?: A }[] | null };
type Nombre = { name?: string };

type AvisoGob = {
  id: string;
  links?: { public_url?: string };
  attributes: {
    title: string;
    description?: string;
    remote_modality?: "fully_remote" | "remote_local" | "hybrid" | "no_remote" | string;
    countries?: string[];
    lang?: string;
    category_name?: string;
    published_at: number;
    company?: Relacion<{ name?: string; logo?: string }>;
    modality?: Relacion<{ locale_key?: string }>;
    location_cities?: Relacion<{ name?: string; country?: string }>;
    location_tenants?: Relacion<Nombre>;
    location_regions?: Relacion<Nombre>;
  };
};

const BASE = "https://www.getonbrd.com/api/v0";
// Pedimos que cada aviso venga con los datos de empresa, ubicación y jornada incluidos
const EXPANDIR = encodeURIComponent(
  JSON.stringify(["company", "location_tenants", "location_regions", "location_cities", "modality"])
);

// Devuelve siempre una lista, venga un elemento o varios
function lista<A>(rel?: Relacion<A>): { id: string; attributes?: A }[] {
  const d = rel?.data;
  if (!d) return [];
  return Array.isArray(d) ? d : [d];
}

function convertir(a: AvisoGob): Oferta {
  const at = a.attributes;
  const empresa = lista(at.company)[0]?.attributes;
  const titulo = limpiarTitulo(at.title);

  let modalidad: Modalidad;
  let region: Region;
  let ubicacion: string;

  if (at.remote_modality === "fully_remote") {
    // En Get on Board "Totalmente remoto" = "100% remoto desde cualquier país"
    modalidad = "Remoto";
    region = "Global";
    ubicacion = "Remoto global";
  } else if (at.remote_modality === "remote_local") {
    // Remoto, pero solo desde ciertos países o zonas. Si no dice cuáles, no se puede saber: "Otras".
    modalidad = "Remoto";
    const lugares = [...lista(at.location_tenants), ...lista(at.location_regions)].map(
      (l) => l.attributes?.name ?? l.id
    );
    region = lugares.length ? regionRemota(lugares) : "Otras";
    ubicacion = lugares.length ? ubicacionRemota(region, lugares) : "Remoto (país sin especificar)";
  } else {
    modalidad = at.remote_modality === "hybrid" ? "Híbrido" : "Presencial";
    const ciudad = lista(at.location_cities)[0]?.attributes;
    const pais = ciudad?.country ?? at.countries?.find((c) => c !== "Remote") ?? null;
    region = regionPresencial(pais);
    const paisCorto = pais && region === "Argentina" ? "AR" : pais ? nombrePais(pais) : "";
    ubicacion = [ciudad?.name, paisCorto].filter(Boolean).join(", ") || "Sin especificar";
  }

  return {
    id: `getonboard-${a.id}`,
    titulo,
    empresa: empresa?.name ? limpiarTitulo(empresa.name) : "Empresa confidencial",
    logo: empresa?.logo || null,
    ubicacion,
    region,
    jornada: unificarJornada(lista(at.modality)[0]?.attributes?.locale_key),
    modalidad,
    idioma:
      at.lang === "es" ? "En español" : at.lang === "en" ? "En inglés" : detectarIdioma(titulo, sinHtml(at.description)),
    categoria: unificarCategoria(at.category_name, titulo),
    fecha: fechaUnix(at.published_at),
    link: a.links?.public_url ?? `https://www.getonbrd.com/jobs/${a.id}`,
    fuente: "Get on Board",
    fuenteUrl: "https://www.getonbrd.com",
  };
}

export async function traerGetOnBoard(): Promise<Oferta[]> {
  const categorias = await pedirJson<{ data: { id: string }[] }>(`${BASE}/categories?per_page=100`);
  const ids = categorias.data.map((c) => c.id);

  // De a 4 categorías a la vez, para no saturar a la fuente.
  // Si alguna categoría falla, seguimos con las demás.
  const avisos: AvisoGob[] = [];
  let fallas = 0;
  for (let i = 0; i < ids.length; i += 4) {
    const tanda = await Promise.allSettled(
      ids.slice(i, i + 4).map((id) =>
        pedirJson<{ data: AvisoGob[] }>(`${BASE}/categories/${id}/jobs?per_page=100&page=1&expand=${EXPANDIR}`)
      )
    );
    for (const r of tanda) {
      if (r.status === "fulfilled") avisos.push(...r.value.data);
      else fallas++;
    }
  }
  if (fallas === ids.length) throw new Error("Get on Board: fallaron todas las categorías");
  return avisos.map(convertir);
}
