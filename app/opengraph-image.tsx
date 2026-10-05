// Imagen de vista previa que aparece al compartir el link por WhatsApp, LinkedIn, etc.
// Se genera sola al construir la página, con los colores del sitio.

import { ImageResponse } from "next/og";

export const alt = "Luis Alberto: empleos, recursos y oportunidades para Argentina y LATAM";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function ImagenOG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(180deg, #eef5ef, #ffffff)",
          color: "#1b2a21",
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            background: "#dfeee2",
            color: "#1f3d2b",
            fontSize: 30,
            fontWeight: 600,
            padding: "10px 22px",
            borderRadius: 12,
          }}
        >
          Más personas. Más oportunidades.
        </div>
        <div style={{ fontSize: 130, fontWeight: 800, color: "#1f3d2b", marginTop: 30, letterSpacing: -5 }}>
          Luis Alberto
        </div>
        <div style={{ fontSize: 52, fontWeight: 800, marginTop: 10 }}>Buscar trabajo ya es un trabajo.</div>
        <div style={{ fontSize: 32, color: "#5d6b62", marginTop: 26 }}>
          Empleos, cursos y recursos para Argentina y LATAM, en un solo lugar.
        </div>
      </div>
    ),
    size
  );
}
