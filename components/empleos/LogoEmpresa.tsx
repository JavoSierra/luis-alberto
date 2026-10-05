"use client";

// Logo de la empresa (el que manda la fuente). Si no hay o no carga, muestra las iniciales sobre un color.

import { useState } from "react";

const COLORES = ["#1f3d2b", "#3f7a54", "#6b8f71", "#8a6d3b", "#4a6fa5", "#a0522d"];

function iniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .filter((p) => /[a-zA-ZáéíóúñÁÉÍÓÚÑ0-9]/.test(p[0] ?? ""))
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

// El mismo nombre siempre da el mismo color
function color(nombre: string): string {
  let suma = 0;
  for (const letra of nombre) suma = (suma + letra.charCodeAt(0)) % 997;
  return COLORES[suma % COLORES.length];
}

export default function LogoEmpresa({ empresa, logo }: { empresa: string; logo: string | null }) {
  const [fallo, setFallo] = useState(false);

  if (logo && !fallo) {
    return (
      // Se usa <img> común (no next/image) porque los logos vienen de sitios externos que cambian
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt=""
        width={42}
        height={42}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFallo(true)}
        className="h-[42px] w-[42px] rounded-[10px] border border-borde bg-white object-contain"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] text-[.95rem] font-extrabold text-white"
      style={{ background: color(empresa) }}
    >
      {iniciales(empresa) || "?"}
    </div>
  );
}
