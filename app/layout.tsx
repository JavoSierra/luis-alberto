import type { Metadata } from "next";
import { Caveat, Manrope } from "next/font/google";
import { SITIO } from "@/lib/config";
import "./globals.css";

// Fuentes de Google Fonts. next/font las descarga al construir la página,
// así el navegador de la gente no se conecta a Google.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600"],
});

// Título, descripción y vista previa (Open Graph) para cuando se comparte por WhatsApp o redes.
// La imagen de la vista previa se genera en app/opengraph-image.tsx.
export const metadata: Metadata = {
  metadataBase: new URL(SITIO.url),
  title: SITIO.titulo,
  description: SITIO.descripcion,
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: SITIO.nombre,
    title: SITIO.titulo,
    description: SITIO.descripcion,
  },
  twitter: {
    card: "summary_large_image",
    title: SITIO.titulo,
    description: SITIO.descripcion,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${manrope.variable} ${caveat.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
