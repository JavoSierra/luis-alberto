"use client";

// Header fijo: logo, menú (hamburguesa en celular) y botón "Un mejor futuro" con su menú desplegable.

import { useEffect, useRef, useState } from "react";
import { EVENTO_VER_GUARDADOS, useGuardados } from "@/lib/guardados";

const LINKS = [
  { href: "#empleos", texto: "Empleos" },
  { href: "#compartir", texto: "Compartir" },
  { href: "#recursos", texto: "Recursos" },
  { href: "#sobre", texto: "Sobre" },
];

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [futuroAbierto, setFuturoAbierto] = useState(false);
  const futuroRef = useRef<HTMLDivElement>(null);
  const guardados = useGuardados();

  // Cierra el desplegable al tocar en cualquier otro lado o al apretar Escape
  useEffect(() => {
    function alClic(ev: MouseEvent) {
      if (!futuroRef.current?.contains(ev.target as Node)) setFuturoAbierto(false);
    }
    function alTecla(ev: KeyboardEvent) {
      if (ev.key === "Escape") {
        setFuturoAbierto(false);
        setMenuAbierto(false);
      }
    }
    document.addEventListener("click", alClic);
    document.addEventListener("keydown", alTecla);
    return () => {
      document.removeEventListener("click", alClic);
      document.removeEventListener("keydown", alTecla);
    };
  }, []);

  // Al elegir un link se cierran los menús
  function cerrarTodo() {
    setMenuAbierto(false);
    setFuturoAbierto(false);
  }

  const itemDesple = "rounded-lg px-3 py-2.5 text-[.9rem] font-semibold text-tinta no-underline hover:bg-verde-claro";

  return (
    <header className="sticky top-0 z-20 border-b border-borde bg-white/94 backdrop-blur-[8px]">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <a href="#inicio" className="text-[1.3rem] font-extrabold tracking-[-.03em] text-verde-oscuro no-underline">
          Luis Alberto
        </a>

        {/* Botón hamburguesa: solo en celular */}
        <button
          type="button"
          className="inline-flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-[10px] border border-borde menu:hidden"
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
          aria-controls="menu"
          onClick={() => setMenuAbierto((a) => !a)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M3 5h14M3 10h14M3 15h14" />
          </svg>
        </button>

        <nav
          id="menu"
          className={`${menuAbierto ? "flex" : "hidden"} absolute top-16 right-0 left-0 flex-col items-stretch gap-1 border-b border-borde bg-white px-5 pt-3 pb-[18px] menu:static menu:flex menu:flex-row menu:items-center menu:gap-7 menu:border-0 menu:bg-transparent menu:p-0`}
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={cerrarTodo}
              className="px-1 py-2.5 text-base font-semibold text-gris no-underline hover:text-verde-oscuro menu:p-0 menu:text-[.9rem]"
            >
              {l.texto}
            </a>
          ))}

          <div className="relative" ref={futuroRef}>
            <button
              type="button"
              className="btn btn-verde px-4! py-[9px]! text-[.88rem]!"
              aria-expanded={futuroAbierto}
              aria-controls="desple"
              onClick={() => setFuturoAbierto((a) => !a)}
            >
              Un mejor futuro
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M2.5 4.5 6 8l3.5-3.5" />
              </svg>
            </button>

            {futuroAbierto && (
              <div
                id="desple"
                className="mt-1.5 flex min-w-[220px] flex-col rounded-xl border border-borde bg-white p-1.5 menu:absolute menu:top-[calc(100%+8px)] menu:right-0 menu:mt-0 menu:shadow-suave"
              >
                <a
                  href="#empleos"
                  className={itemDesple}
                  onClick={() => {
                    // Avisa a la sección Empleos que muestre solo las guardadas
                    window.dispatchEvent(new Event(EVENTO_VER_GUARDADOS));
                    cerrarTodo();
                  }}
                >
                  Mis ofertas guardadas {guardados.length > 0 && `(${guardados.length})`}
                </a>
                <a href="#compartir" className={itemDesple} onClick={cerrarTodo}>
                  Compartir una oferta
                </a>
                <a href="#recursos" className={itemDesple} onClick={cerrarTodo}>
                  Mejorar mi CV
                </a>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
