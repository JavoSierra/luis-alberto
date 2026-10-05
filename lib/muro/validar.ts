// Reglas del muro que se usan tanto en el navegador (para avisar rápido) como en el servidor (la validación real).

export const MAX_COMENTARIO = 120;
export const MAX_URL = 500;

export type Publicacion = {
  id: string;
  url: string;
  dominio: string;
  comentario: string | null;
  creado: string;
};

/** Dominio visible del link, sin "www." (ej. "linkedin.com"). */
export function dominio(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/**
 * Revisa que el link sea una dirección https completa y razonable.
 * Devuelve el link limpio, o null si no sirve.
 */
export function urlValida(texto: string): string | null {
  const limpio = texto.trim();
  if (!limpio || limpio.length > MAX_URL) return null;
  try {
    const u = new URL(limpio);
    if (u.protocol !== "https:") return null;
    if (u.username || u.password) return null; // links con usuario/contraseña adentro: no
    const host = u.hostname;
    if (!host.includes(".") || host === "localhost") return null;
    if (/^[\d.]+$/.test(host) || host.startsWith("[")) return null; // direcciones IP: no
    return u.toString();
  } catch {
    return null;
  }
}

/** Limpia el comentario: saca caracteres raros y espacios de más. */
export function limpiarComentario(texto: string): string {
  return texto
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Separa lo que la persona escribió en el chat en link + comentario.
 * Ej: "https://empleo.com/123 ¡Buscan admin!" → { url: "https://empleo.com/123", comentario: "¡Buscan admin!" }
 */
export function separarMensaje(texto: string): { url: string | null; comentario: string } {
  const encontrado = texto.match(/https?:\/\/\S+/i);
  if (!encontrado) return { url: null, comentario: limpiarComentario(texto) };
  const url = encontrado[0].replace(/[),.;!?]+$/, ""); // saca signos pegados al final del link
  const comentario = limpiarComentario(texto.replace(encontrado[0], " "));
  return { url, comentario };
}
