// Tabla propia de categorías: unifica los nombres que usa cada fuente.
// Se revisan las reglas en orden; gana la primera que coincide.

const REGLAS: { categoria: string; patron: RegExp }[] = [
  // "Data entry" es carga de datos (tarea administrativa), no ciencia de datos
  { categoria: "Administración y finanzas", patron: /data entry|carga de datos/ },
  { categoria: "Datos e IA", patron: /\bdata\b|datos|analytics|machine learning|\bai\b|\bml\b|\bia\b|scientist/ },
  { categoria: "Diseño", patron: /design|\bux\b|\bui\b|creative|diseno/ },
  { categoria: "Infraestructura y QA", patron: /\bqa\b|test|devops|sysadmin|infrastructure|security|cybersecurity|hardware|cloud/ },
  { categoria: "Desarrollo", patron: /software|programming|developer|engineer|mobile|front.?end|back.?end|full.?stack|web|desarrollo|programacion/ },
  { categoria: "Marketing", patron: /marketing|\bseo\b|advertising|media|growth|social/ },
  { categoria: "Contenido", patron: /content|writ|copy|editor|redacc/ },
  { categoria: "Ventas", patron: /sales|business development|account|ventas/ },
  { categoria: "Atención al cliente", patron: /support|customer|success|soporte|atencion/ },
  { categoria: "Producto y gestión", patron: /product|project|program|agile|innovation|operations|management|gestion/ },
  { categoria: "Administración y finanzas", patron: /financ|accounting|admin|legal|bookkeep|contab/ },
  { categoria: "Recursos humanos", patron: /\bhr\b|recruit|people|talent|human/ },
  { categoria: "Educación", patron: /educat|teach|coach|learning|tutor/ },
];

/** Recibe los nombres de categoría de la fuente (y opcionalmente el título) y devuelve la categoría propia. */
export function unificarCategoria(...textos: (string | null | undefined)[]): string {
  const texto = textos
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[-_]/g, " ")
    .toLowerCase();
  for (const r of REGLAS) if (r.patron.test(texto)) return r.categoria;
  return "Otras";
}
