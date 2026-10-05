"use client";

// Cartelito que aparece abajo unos segundos (ej. "Oferta guardada").
// Cualquier parte de la página lo muestra llamando a avisar("mensaje").

import { useEffect, useState } from "react";

const EVENTO = "la-toast";

export function avisar(mensaje: string) {
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: mensaje }));
}

export default function Toast() {
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    let reloj: ReturnType<typeof setTimeout>;
    function mostrar(ev: Event) {
      setMensaje((ev as CustomEvent<string>).detail);
      clearTimeout(reloj);
      reloj = setTimeout(() => setMensaje(null), 2800);
    }
    window.addEventListener(EVENTO, mostrar);
    return () => {
      window.removeEventListener(EVENTO, mostrar);
      clearTimeout(reloj);
    };
  }, []);

  return (
    <div role="status" aria-live="polite">
      {mensaje && (
        <div className="fixed bottom-[calc(24px+env(safe-area-inset-bottom,0px))] left-1/2 z-50 max-w-[calc(100%-32px)] -translate-x-1/2 rounded-[10px] bg-verde-oscuro px-[18px] py-[11px] text-[.9rem] font-semibold text-white shadow-suave">
          {mensaje}
        </div>
      )}
    </div>
  );
}
