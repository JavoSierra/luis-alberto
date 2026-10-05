// Sección "Oportunidades que se comparten": explica cómo funciona el muro y sus reglas.
// El muro en sí vive en el chat del hero (decisión del 5/10/2026); acá hay un botón que sube hasta él.

import Nota from "./Nota";

export default function Compartir({ muroActivo }: { muroActivo: boolean }) {
  return (
    <section id="compartir" className="bg-verde-claro py-11">
      <div className="wrap grid grid-cols-1 items-center gap-10 min-[861px]:grid-cols-[1fr_1.1fr]">
        <div className="min-w-0">
          <h2 className="text-[clamp(1.6rem,4vw,2rem)] font-extrabold">Oportunidades que se comparten</h2>
          <p className="mt-1.5 text-gris">
            ¿Viste una búsqueda que no es para vos pero le puede servir a otra persona? Pegá el link y queda en el muro
            para todos.
          </p>
          <ul className="mt-4 flex flex-col gap-2.5 text-[.95rem] text-gris">
            {[
              <>Solo links a la publicación original, más un comentario corto si querés.</>,
              <>Cada oferta se revisa antes de aparecer y se borra sola a los 30 días.</>,
              <>No pedimos nombre ni mail.</>,
              <>
                <b className="text-tinta">Nunca pagues para postularte.</b> Si una oferta te pide plata, es una estafa.
              </>,
            ].map((texto, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-[.55em] h-2 w-2 flex-none rounded-full bg-verde" aria-hidden="true" />
                <span>{texto}</span>
              </li>
            ))}
          </ul>
          <Nota className="mt-[26px]">Así entre todos nos ayudamos.</Nota>
        </div>

        {/* Tarjeta que lleva al chat del hero */}
        <div className="min-w-0 rounded-[22px] bg-white p-7 shadow-chat">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-burbuja text-verde">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
              </svg>
            </div>
            <div>
              <b className="block text-[1.05rem] leading-tight">Muro de la comunidad</b>
              <span className="text-[.85rem] text-gris">Vive en el chat de arriba de todo</span>
            </div>
          </div>
          <p className="mt-4 text-[.95rem] text-gris">
            Pegá el link de la oferta en el chat de la portada. Después de revisarla, la ven todas las personas que
            entran a la página.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a className="btn btn-verde" href="#chat">
              Ir al chat para compartir <span aria-hidden="true">↑</span>
            </a>
            {!muroActivo && (
              <span className="rounded-full bg-aviso-bg px-2.5 py-1 text-[.72rem] font-bold text-aviso-tx">Próximamente</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
