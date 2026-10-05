"use client";

// Chat estilo WhatsApp del hero. ES el muro de Compartir (decisión del 5/10/2026):
// arriba los mensajes fijos de bienvenida y abajo las ofertas que comparte la gente.
// - Cada publicación entra "en revisión"; la ven todos cuando el dueño la aprueba en Supabase.
// - Quien publica ve su propio mensaje con "En revisión" (se guarda en su navegador).
// - Si la base de datos no está conectada (activo = false), el campo queda deshabilitado con "Próximamente".

import { useEffect, useRef, useState } from "react";
import { avisar } from "@/components/Toast";
import { dominio, MAX_COMENTARIO, separarMensaje, urlValida, type Publicacion } from "@/lib/muro/validar";
import { Avatar } from "./Dibujos";

const CLAVE_PROPIAS = "la-muro-propias";
const CLAVE_REPORTADAS = "la-muro-reportadas";
const TREINTA_DIAS_MS = 30 * 86_400_000;

// Lectura y escritura en el navegador, siempre con try/catch
function leerLista<T>(clave: string): T[] {
  try {
    const v = JSON.parse(localStorage.getItem(clave) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function guardarLista(clave: string, lista: unknown[]) {
  try {
    localStorage.setItem(clave, JSON.stringify(lista));
  } catch {
    // si no se puede guardar, no pasa nada
  }
}

// "Recién", "Hace 20 min", "Hace 3 h", "Ayer", "Hace 4 días"
function cuando(fechaIso: string): string {
  const min = Math.floor((Date.now() - new Date(fechaIso).getTime()) / 60_000);
  if (min < 2) return "Recién";
  if (min < 60) return `Hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Hace ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? "Ayer" : `Hace ${d} días`;
}

type Mensaje = Publicacion & { propia: boolean; pendiente: boolean };

export default function ChatBienvenida({ activo }: { activo: boolean }) {
  const [aprobadas, setAprobadas] = useState<Publicacion[]>([]);
  const [propias, setPropias] = useState<Publicacion[]>([]);
  const [reportadas, setReportadas] = useState<string[]>([]);
  const [texto, setTexto] = useState("");
  const [trampa, setTrampa] = useState(""); // campo invisible contra robots
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const zonaMensajes = useRef<HTMLDivElement>(null);

  // Al abrir la página: trae las publicaciones aprobadas y recupera las propias de este navegador
  useEffect(() => {
    if (!activo) return;
    let vigente = true;
    fetch("/api/muro")
      .then((r) => r.json())
      .then((d: { publicaciones?: Publicacion[] }) => d.publicaciones ?? [])
      .catch(() => [] as Publicacion[])
      .then((lista) => {
        if (!vigente) return;
        const ahora = Date.now();
        setAprobadas(lista);
        setPropias(
          leerLista<Publicacion>(CLAVE_PROPIAS).filter((p) => ahora - new Date(p.creado).getTime() < TREINTA_DIAS_MS)
        );
        setReportadas(leerLista<string>(CLAVE_REPORTADAS));
      });
    return () => {
      vigente = false;
    };
  }, [activo]);

  // Junta aprobadas + propias (sin repetir) y las ordena por fecha
  const idsAprobadas = new Set(aprobadas.map((p) => p.id));
  const idsPropias = new Set(propias.map((p) => p.id));
  const mensajes: Mensaje[] = [
    ...aprobadas.map((p) => ({ ...p, propia: idsPropias.has(p.id), pendiente: false })),
    ...propias.filter((p) => !idsAprobadas.has(p.id)).map((p) => ({ ...p, propia: true, pendiente: true })),
  ].sort((a, b) => a.creado.localeCompare(b.creado));

  // Baja hasta el último mensaje cuando cambian (solo dentro del chat, sin mover la página)
  useEffect(() => {
    const zona = zonaMensajes.current;
    if (zona) zona.scrollTop = zona.scrollHeight;
  }, [mensajes.length]);

  async function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    if (enviando) return;
    const { url, comentario } = separarMensaje(texto);
    if (!url || !urlValida(url)) {
      setError("Pegá un link completo que empiece con https://");
      return;
    }
    if (comentario.length > MAX_COMENTARIO) {
      setError(`El comentario puede tener hasta ${MAX_COMENTARIO} caracteres.`);
      return;
    }
    setError(null);
    setEnviando(true);
    try {
      const r = await fetch("/api/muro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, comentario, sitio: trampa }),
      });
      const d: { ok?: boolean; publicacion?: Publicacion | null; error?: string } = await r.json();
      if (!r.ok || !d.ok) {
        setError(d.error ?? "No pudimos guardar tu oferta. Probá de nuevo en un rato.");
        return;
      }
      if (d.publicacion) {
        const nuevas = [...propias, d.publicacion];
        setPropias(nuevas);
        guardarLista(CLAVE_PROPIAS, nuevas);
      }
      setTexto("");
      avisar("¡Gracias! Tu oferta queda en revisión y aparece cuando se apruebe.");
    } catch {
      setError("No pudimos guardar tu oferta. Revisá tu conexión y probá de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  async function reportar(id: string) {
    if (!window.confirm("¿Reportar esta publicación? La vamos a revisar.")) return;
    try {
      const r = await fetch("/api/muro/reportar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!r.ok) throw new Error();
      const nuevas = [...reportadas, id];
      setReportadas(nuevas);
      guardarLista(CLAVE_REPORTADAS, nuevas);
      avisar("Gracias por avisar. La vamos a revisar.");
    } catch {
      avisar("No pudimos enviar el reporte. Probá de nuevo.");
    }
  }

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

      <div
        ref={zonaMensajes}
        className="flex max-h-[380px] flex-col gap-3 overflow-y-auto bg-chat p-4"
        aria-live="polite"
        aria-label="Muro de ofertas compartidas"
      >
        {/* Mensajes fijos de bienvenida */}
        <div className="msj">
          ¿Encontraste una oferta que puede servirle a alguien?<time>10:24</time>
        </div>
        <div className="msj yo">
          Pegala acá y compartila. 💚<time>10:24 ✓✓</time>
        </div>
        <div className="msj">
          Así entre todos nos ayudamos. 🙌<time>10:25</time>
        </div>

        {/* Mientras el muro no está conectado, se muestra el ejemplo del prototipo */}
        {!activo && (
          <div className="msj yo">
            <a href="#compartir">https://jobs.example.com/frontend</a>
            <br />
            ¡Esta puede estar buena!<time>10:26 ✓✓</time>
          </div>
        )}

        {/* Ofertas compartidas por la comunidad */}
        {mensajes.map((m) => (
          <div key={m.id} className={`msj ${m.propia ? "yo" : ""}`}>
            <span className="mb-1 inline-block rounded-md bg-[rgba(31,61,43,.09)] px-[7px] py-px text-[.72rem] font-bold">
              {m.dominio || dominio(m.url)}
            </span>
            <br />
            <a href={m.url} target="_blank" rel="noopener noreferrer nofollow ugc">
              {m.url}
            </a>
            {m.comentario && (
              <>
                <br />
                {m.comentario}
              </>
            )}
            <time>
              {m.pendiente && <span className="text-[.72rem] font-bold text-aviso-tx">En revisión · </span>}
              {cuando(m.creado)}
              {!m.propia && !reportadas.includes(m.id) && (
                <>
                  {" · "}
                  <button
                    type="button"
                    onClick={() => reportar(m.id)}
                    className="cursor-pointer text-gris-claro underline-offset-2 hover:underline"
                  >
                    Reportar
                  </button>
                </>
              )}
            </time>
          </div>
        ))}
      </div>

      {activo ? (
        <form onSubmit={enviar} className="px-3.5 pt-3 pb-2">
          <div className="flex items-center gap-2.5">
            <input
              type="text"
              inputMode="url"
              value={texto}
              onChange={(e) => {
                setTexto(e.target.value);
                setError(null);
              }}
              maxLength={MAX_COMENTARIO + 520}
              placeholder="Pegá una oferta..."
              aria-label="Link de la oferta y un comentario corto (opcional)"
              aria-describedby="chat-ayuda"
              className="min-w-0 flex-1 rounded-full border border-borde bg-white px-4 py-2.5 text-[.9rem]"
            />
            {/* Campo trampa: invisible para las personas, los robots lo completan */}
            <input
              type="text"
              name="sitio"
              value={trampa}
              onChange={(e) => setTrampa(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-px w-px opacity-0"
            />
            <button
              type="submit"
              disabled={enviando || !texto.trim()}
              aria-label="Compartir oferta"
              className="inline-flex h-[42px] w-[42px] flex-none cursor-pointer items-center justify-center rounded-full bg-verde text-white hover:bg-verde-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 20l18-8L3 4v6l11 2-11 2z" />
              </svg>
            </button>
          </div>
          {error && (
            <p role="alert" className="mt-2 px-1 text-[.82rem] font-semibold text-[#a3322a]">
              {error}
            </p>
          )}
          <p id="chat-ayuda" className="mt-2 px-1 text-[.72rem] leading-snug text-gris-claro">
            Pegá el link y, si querés, un comentario corto. Se revisa antes de aparecer.{" "}
            <b className="text-gris">Nunca pagues para postularte.</b>
          </p>
        </form>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
