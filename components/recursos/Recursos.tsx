// Sección "Recursos gratuitos": tres tarjetas con links que se editan en /data (ver data/LEEME.md).

import cursos from "@/data/cursos.json";
import cv from "@/data/cv.json";
import ingles from "@/data/ingles.json";
import { PilaLibros } from "@/components/Dibujos";
import Nota from "@/components/Nota";
import TarjetaRecurso from "./TarjetaRecurso";

// Íconos (dibujos SVG) de cada tarjeta
const ICONO_LIBRO = <path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v13c-3-1-6-1-9 1-3-2-6-2-9-1zM12 6v13" />;
const ICONO_BIRRETE = <path d="M2 9l10-5 10 5-10 5zM6 11.5V16c3 3 9 3 12 0v-4.5M22 9v6" />;
const ICONO_HOJA = <path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6" />;

export default function Recursos() {
  return (
    <section id="recursos" className="py-11">
      <div className="wrap">
        <div className="mb-5">
          <h2 className="text-[clamp(1.6rem,4vw,2rem)] font-extrabold">Recursos gratuitos</h2>
          <p className="mt-0.5 text-gris">Herramientas y contenido para potenciar tu búsqueda.</p>
        </div>
        <div className="grid grid-cols-1 items-start gap-4 min-[1001px]:grid-cols-[repeat(3,1fr)_220px]">
          <TarjetaRecurso recurso={cursos} icono={ICONO_LIBRO} />
          <TarjetaRecurso recurso={ingles} icono={ICONO_BIRRETE} />
          <TarjetaRecurso recurso={cv} icono={ICONO_HOJA} />
          <div
            aria-hidden="true"
            className="flex flex-row flex-wrap items-center justify-center gap-7 pt-3 min-[1001px]:flex-col min-[1001px]:gap-3.5 min-[1001px]:pt-1"
          >
            <Nota trazo="ninguno" giro={-8}>
              Pequeñas herramientas también abren grandes puertas.
            </Nota>
            <PilaLibros />
          </div>
        </div>
      </div>
    </section>
  );
}
