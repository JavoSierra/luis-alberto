// Criterio de región (ver CLAUDE.md). Decide si una oferta es Argentina, LATAM, Global u Otras.
// Regla de oro: si no se puede saber, es "Otras" (nunca "Global" por las dudas).

import type { Region } from "./tipos";

// Saca tildes, pasa a minúsculas y limpia espacios
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

// Países de Latinoamérica y el Caribe (en inglés y en español, ya normalizados)
const PAISES_LATAM = new Set([
  "argentina", "bolivia", "brazil", "brasil", "chile", "colombia", "costa rica", "cuba",
  "dominican republic", "republica dominicana", "ecuador", "el salvador", "guatemala", "honduras",
  "mexico", "nicaragua", "panama", "paraguay", "peru", "puerto rico", "uruguay", "venezuela",
  "belize", "guyana", "suriname", "haiti", "jamaica", "trinidad and tobago", "bahamas", "barbados",
]);

// Palabras que indican "toda Latinoamérica"
const ZONAS_LATAM = new Set(["latam", "latin america", "latinoamerica", "south america", "central america", "americas"]);

// Palabras que indican "cualquier país"
const ZONAS_GLOBALES = new Set(["anywhere", "worldwide", "global", "world", "remote", "remoto"]);

export function esPaisLatam(pais: string): boolean {
  return PAISES_LATAM.has(normalizar(pais));
}

/**
 * Región de una oferta REMOTA según la lista de países o zonas desde donde se puede trabajar.
 * - Lista vacía o "Anywhere" → Global
 * - Solo Argentina → Argentina
 * - Incluye Argentina o toda LATAM (aunque sume otras regiones) → LATAM
 * - Cualquier otra cosa (ej. solo EE.UU., solo México) → Otras: desde Argentina no se puede aplicar
 */
export function regionRemota(lugares: string[]): Region {
  const lista = lugares.map(normalizar).filter(Boolean);
  if (lista.length === 0 || lista.some((l) => ZONAS_GLOBALES.has(l))) return "Global";
  if (lista.length === 1 && lista[0] === "argentina") return "Argentina";
  if (lista.some((l) => l === "argentina" || ZONAS_LATAM.has(l))) return "LATAM";
  return "Otras";
}

/** Región de una oferta PRESENCIAL o HÍBRIDA según el país donde está el puesto. */
export function regionPresencial(pais: string | null | undefined): Region {
  if (!pais) return "Otras";
  if (normalizar(pais) === "argentina") return "Argentina";
  if (esPaisLatam(pais)) return "LATAM";
  return "Otras";
}

// Nombres de países en español para mostrar en las tarjetas
const NOMBRES_ES: Record<string, string> = {
  brazil: "Brasil", mexico: "México", peru: "Perú", panama: "Panamá",
  "dominican republic": "Rep. Dominicana", "united states": "EE.UU.", usa: "EE.UU.", us: "EE.UU.",
  "united kingdom": "Reino Unido", uk: "Reino Unido", canada: "Canadá", spain: "España",
  germany: "Alemania", france: "Francia", europe: "Europa", emea: "Europa, Medio Oriente y África",
  apac: "Asia-Pacífico", "north america": "Norteamérica",
};

export function nombrePais(pais: string): string {
  return NOMBRES_ES[normalizar(pais)] ?? pais.trim();
}

/** Texto de ubicación para una oferta remota, ej. "Remoto LATAM" o "Remoto, solo EE.UU." */
export function ubicacionRemota(region: Region, lugares: string[]): string {
  if (region === "Global") return "Remoto global";
  if (region === "Argentina") return "Remoto desde Argentina";
  if (region === "LATAM") return "Remoto LATAM";
  const nombres = lugares.map(nombrePais).filter(Boolean);
  if (nombres.length === 0) return "Remoto";
  return nombres.length <= 2 ? `Remoto, solo ${nombres.join(" y ")}` : `Remoto, solo ${nombres.slice(0, 2).join(", ")} y otros`;
}
