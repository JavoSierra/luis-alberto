import type { NextConfig } from "next";

// Encabezados de seguridad: reglas que el navegador aplica a la página.
const enDesarrollo = process.env.NODE_ENV === "development";

// Política de contenido (CSP): de dónde puede cargar cosas la página.
// - Scripts, estilos y fuentes: solo de la propia página.
// - Imágenes: la propia página + los sitios de donde vienen los logos de empresas y las miniaturas de YouTube.
// - Nadie puede meter la página adentro de otra (protege contra engaños tipo "clickjacking").
const politicaDeContenido = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${enDesarrollo ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://getonbrd-prod.s3.amazonaws.com https://jobicy.com https://cdn-images.himalayas.app https://i.ytimg.com",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  // No anunciar con qué tecnología está hecha la página
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: politicaDeContenido },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
