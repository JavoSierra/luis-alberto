// Sección "¿Por qué existe?": caja verde clara con ícono, texto y nota manuscrita.

import Nota from "./Nota";

export default function PorQue() {
  return (
    <section className="pt-11 pb-3">
      <div className="wrap">
        <div className="grid grid-cols-1 items-center gap-3.5 rounded-tarjeta bg-verde-claro p-7 menu:grid-cols-[auto_1fr_auto] menu:gap-6">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-verde-suave text-verde">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="12" cy="7" r="3.2" />
              <circle cx="5" cy="9" r="2.4" />
              <circle cx="19" cy="9" r="2.4" />
              <path d="M6.5 19c0-7 11-7 11 0zM0.8 18c0-5 5-5.5 6-4-1.6 1-2.3 2.5-2.3 4zM23.2 18c0-5-5-5.5-6-4 1.6 1 2.3 2.5 2.3 4z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold">¿Por qué existe?</h2>
            <p className="mt-1.5 max-w-[62ch] text-[.95rem] text-gris">
              Yo también estoy buscando mi próximo paso. Creé este proyecto porque sé lo difícil que puede ser buscar
              trabajo, y quiero ayudar a otras personas que están en la misma. De paso, me sirvió para aprender algo
              que hace una semana no sabía hacer.
            </p>
          </div>
          <Nota>
            Un proyecto real,
            <br />
            con personas reales.
          </Nota>
        </div>
      </div>
    </section>
  );
}
