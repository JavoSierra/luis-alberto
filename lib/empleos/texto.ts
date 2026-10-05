// Ayudas para limpiar los datos que llegan de las fuentes.

import type { Idioma } from "./tipos";

/** Saca las etiquetas HTML y deja solo texto plano. Las descripciones nunca se muestran como HTML. */
export function sinHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Decodifica entidades simples que a veces vienen en títulos (ej. "&amp;"). */
export function limpiarTitulo(texto: string): string {
  return sinHtml(texto).replace(/&#039;|&#39;/g, "'");
}

// Palabras muy comunes de cada idioma, para adivinar en qué está escrita la oferta
const ES = /\b(de|la|el|y|para|con|en|del|los|las|experiencia|buscamos|trabajo|equipo)\b/g;
const EN = /\b(the|and|with|you|to|of|for|our|we|experience|team|work)\b/g;

/** Adivina el idioma mirando el título y un pedazo del texto. Ante la duda, inglés. */
export function detectarIdioma(...textos: string[]): Idioma {
  const t = ` ${textos.join(" ").toLowerCase().slice(0, 1500)} `;
  const es = t.match(ES)?.length ?? 0;
  const en = t.match(EN)?.length ?? 0;
  return es > en ? "En español" : "En inglés";
}

/** Pasa los tipos de jornada de cada fuente a los nombres que usa la página. */
export function unificarJornada(texto: string | null | undefined): string {
  const t = (texto ?? "").toLowerCase();
  if (/part/.test(t)) return "Part-time";
  if (/intern|pasant|practica|práctica/.test(t)) return "Pasantía";
  if (/freelance/.test(t)) return "Freelance";
  if (/contract|temporary|contrato/.test(t)) return "Contrato";
  return "Full-time";
}

/** Convierte segundos desde 1970 (formato "unix") a fecha ISO. */
export function fechaUnix(segundos: number): string {
  return new Date(segundos * 1000).toISOString();
}
