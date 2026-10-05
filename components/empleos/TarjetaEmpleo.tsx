"use client";

// Tarjeta de una oferta: logo, puesto, empresa, ubicación, etiquetas, fecha, fuente y botón "Ver oferta".

import type { Oferta } from "@/lib/empleos/tipos";
import LogoEmpresa from "./LogoEmpresa";

// "Hoy", "Hace 1 día", "Hace 5 días"
function hace(fechaIso: string): string {
  const dias = Math.floor((Date.now() - new Date(fechaIso).getTime()) / 86_400_000);
  if (dias <= 0) return "Hoy";
  if (dias === 1) return "Hace 1 día";
  return `Hace ${dias} días`;
}

type Props = {
  oferta: Oferta;
  guardada: boolean;
  alGuardar: () => void;
};

export default function TarjetaEmpleo({ oferta: o, guardada, alGuardar }: Props) {
  return (
    <article className="flex min-w-0 flex-col gap-1.5 rounded-tarjeta border border-borde bg-white p-[18px] shadow-suave">
      <div className="mb-1.5 flex items-start justify-between">
        <LogoEmpresa empresa={o.empresa} logo={o.logo} />
        <button
          type="button"
          onClick={alGuardar}
          aria-pressed={guardada}
          aria-label={guardada ? "Quitar de guardados" : "Guardar oferta"}
          className={`cursor-pointer rounded-md p-1 ${guardada ? "text-verde" : "text-gris-claro hover:text-gris"}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={guardada ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 3h12v18l-6-4.5L6 21z" />
          </svg>
        </button>
      </div>

      <h3 className="text-base font-bold tracking-[-.01em] [overflow-wrap:anywhere]">{o.titulo}</h3>
      <div className="text-[.85rem] font-semibold">{o.empresa}</div>
      <div className="flex items-center gap-[5px] text-[.82rem] text-gris">
        <svg className="flex-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        {o.ubicacion}
      </div>

      <div className="mt-1 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-verde-suave px-2.5 py-[3px] text-[.74rem] font-semibold text-verde-oscuro">{o.jornada}</span>
        <span className="rounded-full bg-[#f0f2f0] px-2.5 py-[3px] text-[.74rem] font-semibold text-gris">{o.modalidad}</span>
        <span className="rounded-full bg-[#f0f2f0] px-2.5 py-[3px] text-[.74rem] font-semibold text-gris">{o.idioma}</span>
      </div>

      <div className="mt-1 mb-2 text-[.76rem] text-gris-claro">
        {hace(o.fecha)} ·{" "}
        <span className="text-[.72rem]">
          vía{" "}
          <a href={o.fuenteUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
            {o.fuente}
          </a>
        </span>
      </div>

      <a
        href={o.link}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-linea mt-auto justify-center px-3! py-[9px]! text-[.88rem]!"
      >
        Ver oferta <span aria-hidden="true">→</span>
        <span className="sr-only"> (se abre en otra pestaña)</span>
      </a>
    </article>
  );
}
