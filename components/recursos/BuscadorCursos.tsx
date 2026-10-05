"use client";

// Buscador de cursos: la persona escribe qué quiere aprender y le damos links directos
// a esa búsqueda en plataformas gratuitas (YouTube, Claseflix, etc.).
// No usa ninguna clave ni API: solo arma los links. Las plataformas se editan en data/buscador.json.

import { useState } from "react";
import datos from "@/data/buscador.json";

export default function BuscadorCursos() {
  const [texto, setTexto] = useState("");
  const [buscado, setBuscado] = useState("");

  function buscar(palabra: string) {
    const limpio = palabra.trim().slice(0, 80);
    setTexto(limpio);
    setBuscado(limpio);
  }

  return (
    <div className="mb-4 rounded-tarjeta bg-verde-claro p-5 min-[561px]:p-6">
      <h3 className="text-[1.15rem] font-bold">¿Qué querés aprender?</h3>
      <p className="mt-1 text-[.9rem] text-gris">
        Escribí un tema y te llevamos a cursos gratis en YouTube, Claseflix y otras plataformas.
      </p>

      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          buscar(texto);
        }}
        className="mt-4 flex flex-col gap-2.5 min-[481px]:flex-row"
      >
        <input
          type="search"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          maxLength={80}
          placeholder="Ej: Excel, inglés, atención al cliente..."
          aria-label="Tema que querés aprender"
          className="campo min-w-0 flex-1"
        />
        <button type="submit" className="btn btn-verde justify-center" disabled={!texto.trim()}>
          Buscar cursos
        </button>
      </form>

      {/* Ideas para arrancar */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[.8rem] text-gris">Ideas:</span>
        {datos.sugerencias.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => buscar(s)}
            className="cursor-pointer rounded-full border border-borde bg-white px-3 py-1 text-[.8rem] font-semibold text-verde-oscuro hover:border-salvia"
          >
            {s}
          </button>
        ))}
      </div>

      {buscado && (
        <div className="mt-5" aria-live="polite">
          <p className="mb-2.5 text-[.9rem] font-semibold">
            Cursos gratis de “{buscado}” en:
          </p>
          <ul className="grid grid-cols-1 gap-2.5 min-[561px]:grid-cols-2 min-[1001px]:grid-cols-3">
            {datos.plataformas.map((p) => (
              <li key={p.nombre}>
                <a
                  href={p.url.replace("{q}", encodeURIComponent(buscado))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-borde bg-white px-4 py-3 no-underline hover:border-salvia"
                >
                  <span className="min-w-0">
                    <b className="block text-[.92rem] text-verde-oscuro">{p.nombre}</b>
                    <span className="block text-[.78rem] text-gris-claro">{p.detalle}</span>
                  </span>
                  <span aria-hidden="true" className="flex-none text-verde">
                    ↗
                  </span>
                  <span className="sr-only"> (se abre en otra pestaña)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
