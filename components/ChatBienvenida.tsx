// Chat estilo WhatsApp del hero, con los mensajes fijos de bienvenida.
// El campo "Pegá una oferta..." va deshabilitado hasta que exista el muro real de Compartir.

import { Avatar } from "./Dibujos";

export default function ChatBienvenida() {
  return (
    <div id="chat" className="relative z-[1] mx-auto max-w-[400px] overflow-hidden rounded-[22px] bg-white shadow-chat">
      <div className="flex items-center gap-3 border-b border-borde px-4 py-3.5">
        <Avatar tamano={40} />
        <div>
          <b className="block text-[.98rem] leading-[1.2]">Luis Alberto</b>
          <small className="flex items-center gap-[5px] text-[.78rem] text-gris">
            <span className="h-[7px] w-[7px] rounded-full bg-[#2fae5b]" aria-hidden="true" />
            online
          </small>
        </div>
      </div>

      <div className="flex flex-col gap-3 bg-chat p-4">
        <div className="msj">
          ¿Encontraste una oferta que puede servirle a alguien?<time>10:24</time>
        </div>
        <div className="msj yo">
          Pegala acá y compartila. 💚<time>10:24 ✓✓</time>
        </div>
        <div className="msj">
          Así entre todos nos ayudamos. 🙌<time>10:25</time>
        </div>
        <div className="msj yo">
          <a href="#compartir">https://jobs.example.com/frontend</a>
          <br />
          ¡Esta puede estar buena!<time>10:26 ✓✓</time>
        </div>
      </div>

      {/* Cartel "Próximamente" arriba del campo, para que no tape el texto en pantallas angostas */}
      <div className="flex justify-center pt-3">
        <span className="rounded-full bg-aviso-bg px-2.5 py-1 text-[.72rem] font-bold text-aviso-tx">Próximamente</span>
      </div>
      <div className="flex items-center gap-2.5 px-3.5 pt-2 pb-3">
        <input
          type="text"
          disabled
          placeholder="Pegá una oferta..."
          aria-label="Link de la oferta (próximamente)"
          className="min-w-0 flex-1 cursor-not-allowed rounded-full border border-borde bg-white px-4 py-2.5 text-[.9rem]"
        />
        <button
          type="button"
          disabled
          aria-label="Compartir oferta (próximamente)"
          className="inline-flex h-[42px] w-[42px] flex-none cursor-not-allowed items-center justify-center rounded-full bg-verde text-white opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 20l18-8L3 4v6l11 2-11 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
