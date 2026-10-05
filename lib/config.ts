// Datos del sitio que se completan a mano.
// Si un link queda vacío (""), ese botón no se muestra en la página.

export const SITIO = {
  nombre: "Luis Alberto",
  titulo: "Luis Alberto | Empleos, recursos y oportunidades",
  descripcion:
    "Empleos para postularte desde Argentina y LATAM, cursos gratuitos, recursos de inglés y herramientas para tu CV, en un solo lugar.",
  // Dirección pública de la página. En Vercel se completa sola; en local usa localhost.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
};

export const REDES = {
  linkedin: "", // Pendiente: pegar acá el link de tu perfil de LinkedIn
  github: "", // Pendiente: pegar acá el link de tu perfil de GitHub
};
