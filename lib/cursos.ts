// Búsqueda dentro del catálogo de cursos gratis (data/catalogo-cursos.json).
// Funciona en el navegador, sin servidor ni claves: busca mientras la persona escribe.

import catalogo from "@/data/catalogo-cursos.json";

export type Curso = {
  titulo: string;
  url: string;
  plataforma: string;
  autor: string;
  tipo: string;
  imagen: string | null;
  tema: string;
  palabras: string[];
};

export const CURSOS = catalogo as Curso[];

/** Lista de temas, en el orden en que aparecen en el catálogo. */
export const TEMAS = [...new Set(CURSOS.map((c) => c.tema))];

// Minúsculas y sin tildes, para que "ingles" encuentre "Inglés"
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

// Palabras que no ayudan a buscar
const VACIAS = new Set(["de", "del", "la", "el", "los", "las", "y", "en", "para", "con", "un", "una", "curso", "cursos", "aprender", "como", "gratis"]);

/**
 * Busca cursos. Cada palabra escrita suma puntos si aparece en el tema, en las palabras clave,
 * en el título o en el autor. Acepta palabras a medio escribir ("exc" encuentra Excel).
 */
export function buscarCursos(consulta: string): Curso[] {
  const palabras = normalizar(consulta)
    .split(/\s+/)
    .filter((p) => p.length >= 2 && !VACIAS.has(p));
  if (palabras.length === 0) return [];

  // Singular y plural: "planillas" también busca "planilla", "redes" también "red"
  const variantes = (p: string) => [...new Set([p, p.replace(/es$/, ""), p.replace(/s$/, "")])].filter((v) => v.length >= 2);
  const coincide = (texto: string, p: string) =>
    texto.split(/\s+/).some((t) => variantes(p).some((v) => t.startsWith(v)));

  const puntuados = CURSOS.map((curso) => {
    const tema = normalizar(curso.tema);
    const claves = curso.palabras.map(normalizar);
    const titulo = normalizar(curso.titulo);
    const autor = normalizar(curso.autor);
    let puntos = 0;
    for (const p of palabras) {
      let encontrada = false;
      if (coincide(tema, p)) { puntos += 4; encontrada = true; }
      if (claves.some((k) => coincide(k, p))) { puntos += 3; encontrada = true; }
      if (coincide(titulo, p)) { puntos += 2; encontrada = true; }
      if (coincide(autor, p)) { puntos += 1; encontrada = true; }
      if (!encontrada) puntos -= 1; // las palabras que no aparecen restan un poco
    }
    return { curso, puntos };
  });

  return puntuados
    .filter((r) => r.puntos > 0)
    .sort((a, b) => b.puntos - a.puntos)
    .map((r) => r.curso);
}

/** Cursos de un tema. */
export function cursosDelTema(tema: string): Curso[] {
  return CURSOS.filter((c) => c.tema === tema);
}

/** Selección para mostrar antes de buscar: el primero de cada tema. */
export function destacados(cantidad = 6): Curso[] {
  return TEMAS.slice(0, cantidad).map((t) => cursosDelTema(t)[0]).filter(Boolean);
}
