"use client";

// Buscador de cursos gratis "estilo Google", pero adentro de la página:
// - Mientras la persona escribe, aparecen los cursos del catálogo (data/catalogo-cursos.json).
// - Entiende palabras sin tilde, a medio escribir y sinónimos ("planillas" → Excel).
// - Debajo, atajos para seguir buscando el mismo tema en YouTube, Claseflix, etc. (data/buscador.json).
// No usa claves ni APIs externas.

import { useDeferredValue, useMemo, useState } from "react";
import datos from "@/data/buscador.json";
import { buscarCursos, cursosDelTema, destacados, TEMAS } from "@/lib/cursos";
import TarjetaCurso from "./TarjetaCurso";

const POR_PAGINA = 6;

export default function BuscadorCursos() {
  const [texto, setTexto] = useState("");
  const [tema, setTema] = useState<string | null>(null);
  const [mostrar, setMostrar] = useState(POR_PAGINA);
  // Para que escribir se sienta fluido aunque la lista tarde un instante en actualizarse
  const consulta = useDeferredValue(texto.trim());

  const resultados = useMemo(() => {
    if (consulta.length >= 2) return buscarCursos(consulta);
    if (tema) return cursosDelTema(tema);
    return destacados();
  }, [consulta, tema]);

  const buscando = consulta.length >= 2;
  const termino = buscando ? consulta : tema ?? "";

  function elegirTema(t: string) {
    setTexto("");
    setTema((actual) => (actual === t ? null : t));
    setMostrar(POR_PAGINA);
  }

  let titulo = "Para empezar";
  if (buscando) titulo = resultados.length ? `Cursos sobre “${consulta}”` : `No tenemos cursos de “${consulta}” en la lista`;
  else if (tema) titulo = tema;

  return (
    <div className="mb-4 rounded-[22px] bg-verde-claro p-5 min-[561px]:p-7">
      <h3 className="text-[clamp(1.2rem,3vw,1.45rem)] font-extrabold tracking-[-.02em]">¿Qué querés aprender hoy?</h3>
      <p className="mt-1 text-[.92rem] text-gris">Cursos gratis y en español, elegidos para tu búsqueda laboral.</p>

      {/* Caja de búsqueda */}
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative mt-4">
        <svg
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gris-claro"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setMostrar(POR_PAGINA);
          }}
          maxLength={80}
          placeholder="Probá con Excel, inglés, ventas, programación..."
          aria-label="Buscá un curso gratis"
          className="w-full rounded-full border border-borde bg-white py-3.5 pr-5 pl-12 text-[1rem] shadow-suave outline-none focus:border-salvia focus:ring-4 focus:ring-salvia/30"
        />
      </form>

      {/* Temas para tocar */}
      <div className="mt-3.5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] min-[761px]:flex-wrap min-[761px]:overflow-visible">
        {TEMAS.map((t) => {
          const activo = !buscando && tema === t;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={activo}
              onClick={() => elegirTema(t)}
              className={`flex-none cursor-pointer rounded-full border px-3.5 py-1.5 text-[.82rem] font-semibold whitespace-nowrap transition-colors ${
                activo
                  ? "border-verde bg-verde text-white"
                  : "border-borde bg-white text-verde-oscuro hover:border-salvia"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Resultados */}
      <div className="mt-6" aria-live="polite">
        <p className="mb-3 text-[.95rem] font-bold">{titulo}</p>

        {resultados.length > 0 && (
          <div className="grid grid-cols-1 gap-3.5 min-[481px]:grid-cols-2 min-[901px]:grid-cols-3">
            {resultados.slice(0, mostrar).map((c) => (
              <TarjetaCurso key={c.url} curso={c} />
            ))}
          </div>
        )}

        {resultados.length > mostrar && (
          <button
            type="button"
            onClick={() => setMostrar((m) => m + POR_PAGINA)}
            className="mt-4 cursor-pointer text-[.92rem] font-bold text-verde"
          >
            Ver más cursos →
          </button>
        )}

        {/* Atajos a otros sitios con el mismo tema */}
        {termino && (
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-borde pt-4">
            <span className="text-[.85rem] text-gris">
              {resultados.length ? "¿Querés más? Buscá" : "Buscalo en"} “{termino}” en:
            </span>
            {datos.plataformas.map((p) => (
              <a
                key={p.nombre}
                href={p.url.replace("{q}", encodeURIComponent(termino))}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-borde bg-white px-3 py-1 text-[.8rem] font-semibold text-verde-oscuro no-underline hover:border-salvia"
              >
                {p.nombre} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
