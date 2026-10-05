"use client";

// "¿Querés buscar en más lugares?": links directos a portales de empleo.
// - Fila de países: muestra los portales del país elegido (Argentina, de entrada).
// - Grupo "Remoto" y grupo "Entrenamiento de IA": siempre visibles, sirven desde cualquier país.
// Datos: Argentina y Remoto en data/portales.json; el resto de los países en data/portales-paises.json.

import { useState } from "react";
import argentinaYRemoto from "@/data/portales.json";
import otrosPaises from "@/data/portales-paises.json";

type Portal = { nombre: string; url: string; detalle: string };

const [argentina, remoto] = argentinaYRemoto.grupos;
const ia = argentinaYRemoto.ia;
const PAISES: { pais: string; portales: Portal[] }[] = [
  { pais: argentina.titulo, portales: argentina.portales },
  ...otrosPaises.paises,
];

function ListaPortales({ portales }: { portales: Portal[] }) {
  return (
    <ul className="grid grid-cols-1 gap-2 min-[481px]:grid-cols-2 min-[901px]:grid-cols-3">
      {portales.map((p) => (
        <li key={p.url}>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full items-center justify-between gap-3 rounded-xl border border-borde px-3.5 py-2.5 no-underline transition-colors hover:border-salvia hover:bg-verde-claro"
          >
            <span className="min-w-0">
              <b className="block text-[.9rem] text-verde-oscuro">{p.nombre}</b>
              <span className="block text-[.76rem] leading-snug text-gris-claro">{p.detalle}</span>
            </span>
            <span aria-hidden="true" className="flex-none text-verde">
              ↗
            </span>
            <span className="sr-only"> (se abre en otra pestaña)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function PortalesEmpleo() {
  const [pais, setPais] = useState(PAISES[0].pais);
  const elegido = PAISES.find((p) => p.pais === pais) ?? PAISES[0];

  return (
    <div className="mt-8 rounded-tarjeta border border-borde bg-white p-5 shadow-suave min-[561px]:p-6">
      <h3 className="text-[1.15rem] font-bold">¿Querés buscar en más lugares?</h3>
      <p className="mt-1 text-[.9rem] text-gris">
        Muchos laburos presenciales se publican solo en estos portales. Elegí tu país y cargá tu CV en varios.
      </p>

      {/* Selector de país */}
      <div
        role="radiogroup"
        aria-label="País"
        className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] min-[761px]:flex-wrap min-[761px]:overflow-visible"
      >
        {PAISES.map((p) => {
          const activo = p.pais === pais;
          return (
            <button
              key={p.pais}
              type="button"
              role="radio"
              aria-checked={activo}
              onClick={() => setPais(p.pais)}
              className={`flex-none cursor-pointer rounded-full border px-3.5 py-1.5 text-[.82rem] font-semibold whitespace-nowrap transition-colors ${
                activo ? "border-verde bg-verde text-white" : "border-borde bg-white text-verde-oscuro hover:border-salvia"
              }`}
            >
              {p.pais}
            </button>
          );
        })}
      </div>

      <div className="mt-4" aria-live="polite">
        <p className="mb-2 text-[.78rem] font-bold tracking-wide text-gris-claro uppercase">Portales en {elegido.pais}</p>
        <ListaPortales portales={elegido.portales} />
      </div>

      <div className="mt-6">
        <p className="mb-2 text-[.78rem] font-bold tracking-wide text-gris-claro uppercase">
          {remoto.titulo}
        </p>
        <ListaPortales portales={remoto.portales} />
      </div>

      <div className="mt-6">
        <p className="mb-2 text-[.78rem] font-bold tracking-wide text-gris-claro uppercase">{ia.titulo}</p>
        <ListaPortales portales={ia.portales} />
        <p className="mt-3 rounded-[10px] bg-aviso-bg px-3.5 py-2.5 text-[.8rem] leading-snug font-semibold text-aviso-tx">
          {ia.aviso}
        </p>
      </div>
    </div>
  );
}
