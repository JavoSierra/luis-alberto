// Tarjeta de un curso del buscador: foto (o un recuadro con el nombre del sitio), título, autor y sitio.

import type { Curso } from "@/lib/cursos";

// Color del recuadro para los cursos que no traen foto
const COLORES: Record<string, string> = {
  Claseflix: "#3f7a54",
  "Khan Academy": "#1f3d2b",
  Google: "#4a6fa5",
  "Microsoft Learn": "#4a6fa5",
  freeCodeCamp: "#1f3d2b",
  "Capacítate para el empleo": "#8a6d3b",
};

// Sitios que piden crear una cuenta gratis para ver el curso
const PIDEN_CUENTA = new Set(["Claseflix", "Capacítate para el empleo"]);

export default function TarjetaCurso({ curso }: { curso: Curso }) {
  return (
    <a
      href={curso.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-w-0 flex-col overflow-hidden rounded-tarjeta border border-borde bg-white no-underline shadow-suave transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(31,61,43,.06),0_14px_30px_rgba(31,61,43,.12)]"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-verde-suave">
        {curso.imagen ? (
          // <img> común: las miniaturas vienen de YouTube
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={curso.imagen}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center p-4 text-center text-[1.05rem] font-extrabold tracking-[-.02em] text-white"
            style={{ background: COLORES[curso.plataforma] ?? "#6b8f71" }}
          >
            {curso.plataforma}
          </div>
        )}
        <span className="absolute top-2 left-2 rounded-full bg-white/92 px-2 py-0.5 text-[.7rem] font-bold text-verde-oscuro">
          Gratis
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <h4 className="line-clamp-2 text-[.92rem] leading-snug font-bold text-tinta">{curso.titulo}</h4>
        <span className="line-clamp-1 text-[.78rem] text-gris">{curso.autor}</span>
        <span className="mt-auto pt-1.5 text-[.74rem] font-semibold text-gris-claro">
          {curso.plataforma} · {PIDEN_CUENTA.has(curso.plataforma) ? "Con cuenta gratis" : curso.tipo}{" "}
          <span aria-hidden="true">↗</span>
          <span className="sr-only"> (se abre en otra pestaña)</span>
        </span>
      </div>
    </a>
  );
}
