// Formato común de una oferta, sin importar de qué fuente venga.

export type Region = "Argentina" | "LATAM" | "Global" | "Otras";
export type Modalidad = "Remoto" | "Híbrido" | "Presencial";
export type Idioma = "En español" | "En inglés";

export type Oferta = {
  id: string; // único y estable: "fuente-idOriginal". Se usa para guardar ofertas.
  titulo: string;
  empresa: string;
  logo: string | null; // URL del logo que da la fuente (puede fallar: hay iniciales de repuesto)
  ubicacion: string; // texto para mostrar, ej. "Remoto LATAM" o "Santiago, Chile"
  region: Region;
  jornada: string; // "Full-time", "Part-time", "Contrato", "Freelance", "Pasantía"
  modalidad: Modalidad;
  idioma: Idioma;
  categoria: string; // de la tabla propia de lib/empleos/categorias.ts
  fecha: string; // fecha de publicación en formato ISO
  link: string; // publicación original
  fuente: string; // nombre de la fuente, ej. "Jobicy"
  fuenteUrl: string; // sitio de la fuente, para la atribución
};

// Lo que devuelve /api/empleos
export type RespuestaEmpleos = {
  ofertas: Oferta[];
  fuentesConError: string[]; // si no está vacío, se muestra el aviso amarillo
  actualizado: string;
};
