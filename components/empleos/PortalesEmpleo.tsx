// "¿Querés buscar en más lugares?": links directos a portales de empleo (data/portales.json).
// Muchos trabajos presenciales de Argentina no están en las fuentes automáticas, pero sí en estos sitios.

import datos from "@/data/portales.json";

export default function PortalesEmpleo() {
  return (
    <div className="mt-8 rounded-tarjeta border border-borde bg-white p-5 shadow-suave min-[561px]:p-6">
      <h3 className="text-[1.15rem] font-bold">¿Querés buscar en más lugares?</h3>
      <p className="mt-1 text-[.9rem] text-gris">
        Muchos laburos presenciales se publican solo en estos portales. Te conviene tener tu CV cargado en varios.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-5 min-[861px]:grid-cols-2">
        {datos.grupos.map((g) => (
          <div key={g.titulo}>
            <p className="mb-2 text-[.78rem] font-bold tracking-wide text-gris-claro uppercase">{g.titulo}</p>
            <ul className="grid grid-cols-1 gap-2 min-[481px]:grid-cols-2">
              {g.portales.map((p) => (
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
          </div>
        ))}
      </div>
    </div>
  );
}
