// Hero: título, texto, botones y el chat de bienvenida.

import ChatBienvenida from "./ChatBienvenida";
import { Hojas, Taza } from "./Dibujos";
import Nota from "./Nota";

export default function Hero() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg,var(--color-verde-claro),#f6faf6 70%,#fff)" }}
    >
      <Hojas />
      <div className="wrap relative grid grid-cols-1 items-center gap-14 pt-10 pb-16 hero:grid-cols-[1.05fr_.95fr] hero:gap-12 hero:pt-16 hero:pb-[72px]">
        {/* Columna izquierda: textos */}
        <div className="min-w-0">
          <span className="inline-block rounded-lg bg-verde-suave px-3 py-1.5 text-[.82rem] font-semibold text-verde-oscuro">
            Más personas. Más oportunidades.
          </span>
          <h1 className="mt-[18px] text-[clamp(3rem,6.5vw,5rem)] leading-none font-extrabold tracking-[-.045em] text-verde-oscuro">
            Luis Alberto
          </h1>
          <p className="mt-2.5 text-[clamp(1.3rem,3vw,1.75rem)] font-extrabold tracking-[-.02em]">
            Buscar trabajo ya es un trabajo.
          </p>
          <p className="mt-4 max-w-[30em] text-[1.08rem] text-gris">
            Esta página nació para ayudar a personas que están buscando laburo, juntando oportunidades, cursos y
            recursos en un solo lugar. La armé sin ser programador, aprendiendo en el camino.
          </p>
          <div className="mt-[26px] flex flex-wrap gap-3.5">
            <a className="btn btn-verde" href="#empleos">
              Explorar oportunidades <span aria-hidden="true">→</span>
            </a>
            <a className="btn btn-linea" href="#recursos">
              Ver recursos
            </a>
          </div>
          <Nota trazo="largo" className="mt-[34px] ml-6 lg:ml-[110px]">
            La misma búsqueda,
            <br />
            más personas, más oportunidades.
          </Nota>
        </div>

        {/* Columna derecha: chat */}
        {/* Hasta pantallas grandes, la nota va arriba del chat; por eso se deja lugar arriba */}
        <div className="relative mt-8 min-w-0 lg:mt-0 lg:pr-10">
          <Nota
            trazo="curva"
            giro={8}
            className="absolute -top-10 right-0 z-[2] text-[1.25rem]! lg:-top-3.5 lg:-right-2 lg:max-w-[130px]"
          >
            Buenas oportunidades también se comparten.
          </Nota>
          <ChatBienvenida />
          <Taza />
        </div>
      </div>
    </div>
  );
}
