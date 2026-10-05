// Tarjeta de recursos: ícono, título, texto y la lista de links a la vista.

export type Recurso = {
  titulo: string;
  descripcion: string;
  links: { nombre: string; url: string; detalle: string }[];
};

export default function TarjetaRecurso({ recurso, icono }: { recurso: Recurso; icono: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-tarjeta border border-borde bg-white p-5 shadow-suave">
      <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-xl bg-verde-suave text-verde">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
          {icono}
        </svg>
      </div>
      <h3 className="text-[1.05rem] font-bold">{recurso.titulo}</h3>
      <p className="mt-1 text-[.88rem] text-gris">{recurso.descripcion}</p>
      <ul className="mt-3 flex flex-col gap-2 border-t border-borde pt-3 text-[.88rem]">
        {recurso.links.map((l) => (
          <li key={l.url}>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-verde-oscuro underline-offset-2 hover:underline"
            >
              {l.nombre} <span aria-hidden="true">↗</span>
              <span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
            <span className="block text-[.78rem] text-gris-claro">{l.detalle}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
