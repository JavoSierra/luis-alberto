// Sección "Sobre el proyecto": avatar, historia del autor y botones a LinkedIn y GitHub.
// Los links se completan en lib/config.ts. Si un link está vacío, ese botón no aparece.

import { REDES } from "@/lib/config";
import { Avatar } from "./Dibujos";
import Nota from "./Nota";

function IconoLinkedIn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.5h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4z" />
    </svg>
  );
}

function IconoGitHub() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
    </svg>
  );
}

export default function Sobre() {
  return (
    <section id="sobre" className="py-11">
      <div className="wrap">
        <div className="mb-5">
          <h2 className="text-[clamp(1.6rem,4vw,2rem)] font-extrabold">Sobre el proyecto</h2>
        </div>
        <div className="grid grid-cols-1 items-center gap-6 min-[861px]:grid-cols-[auto_1fr_auto]">
          <Avatar tamano={88} etiqueta="Foto de Javier Sierra" />
          <div className="flex min-w-0 flex-col gap-2.5 text-[.95rem] text-gris">
            <p className="max-w-[60ch]">
              Hola, soy quien está detrás de Luis Alberto. Trabajé 9 años en un banco y un día decidí irme a vivir
              afuera: pasé casi 3 años en Australia, donde estudié Business Administration and Management y trabajé de
              todo. Hace casi 2 años volví a Buenos Aires, fui analista administrativo y hoy soy Analista de Calidad de IA.
            </p>
            <p className="max-w-[60ch]">
              No soy programador. Esta página la armé en pocos días con ayuda de inteligencia artificial, aprendiendo
              sobre la marcha. Cambié de rumbo más de una vez y sé lo que cuesta buscar trabajo, por eso junté acá lo que
              sirve.
            </p>
            <p className="max-w-[60ch]">
              Me interesan las personas, los procesos y el talento. Si buscás a alguien que aprende rápido y se adapta,
              conectemos.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {REDES.linkedin && (
              <a className="btn btn-linea" href={REDES.linkedin} target="_blank" rel="noopener noreferrer">
                <IconoLinkedIn /> LinkedIn
              </a>
            )}
            {REDES.github && (
              <a className="btn btn-linea" href={REDES.github} target="_blank" rel="noopener noreferrer">
                <IconoGitHub /> GitHub
              </a>
            )}
            <Nota trazo="ninguno" className="text-[1.2rem]!">
              Conectemos y
              <br />
              sigamos construyendo.
            </Nota>
          </div>
        </div>
      </div>
    </section>
  );
}
