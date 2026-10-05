"use client";

// Panel de control del dueño: moderar el muro, ver el estado de los empleos y accesos rápidos.

import { useCallback, useEffect, useState } from "react";
import type { RespuestaEmpleos } from "@/lib/empleos/tipos";

type Estado = "pendiente" | "aprobada" | "rechazada" | "reportadas";
type Publicacion = {
  id: string;
  url: string;
  dominio: string;
  comentario: string | null;
  estado: string;
  reportes: number;
  creado: string;
  vence: string;
};
type Datos = {
  activo: boolean;
  publicaciones?: Publicacion[];
  cantidades?: { pendientes: number; aprobadas: number; rechazadas: number; reportadas: number };
  error?: string;
};

const PESTANAS: { valor: Estado; texto: string; clave: keyof NonNullable<Datos["cantidades"]> }[] = [
  { valor: "pendiente", texto: "Por revisar", clave: "pendientes" },
  { valor: "aprobada", texto: "Aprobadas", clave: "aprobadas" },
  { valor: "reportadas", texto: "Reportadas", clave: "reportadas" },
  { valor: "rechazada", texto: "Rechazadas", clave: "rechazadas" },
];

const ACCESOS = [
  { texto: "Visitas y países (Vercel Analytics)", url: "https://vercel.com/javiersierra09-1633/luisalberto/analytics" },
  { texto: "Publicaciones de la página (Deployments)", url: "https://vercel.com/javiersierra09-1633/luisalberto/deployments" },
  { texto: "Base de datos (tablas)", url: "https://vercel.com/javiersierra09-1633/~/integrations/supabase/icfg_DwIrjcirMeZA939BUahheymp/resources/storage/store_GEYl7REjUT98JfVM/data?table=public.publicaciones" },
  { texto: "Código del proyecto (GitHub)", url: "https://github.com/JavoSierra/luis-alberto" },
  { texto: "Ver la página pública", url: "https://luisalberto.vercel.app" },
];

function hace(fechaIso: string): string {
  const min = Math.floor((Date.now() - new Date(fechaIso).getTime()) / 60_000);
  if (min < 60) return `hace ${Math.max(min, 1)} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.floor(h / 24)} días`;
}

function Numero({ titulo, valor, nota }: { titulo: string; valor: string | number; nota?: string }) {
  return (
    <div className="rounded-tarjeta border border-borde bg-white p-4 shadow-suave">
      <p className="text-[.8rem] font-semibold text-gris">{titulo}</p>
      <p className="mt-1 text-[1.8rem] leading-none font-extrabold text-verde-oscuro">{valor}</p>
      {nota && <p className="mt-1.5 text-[.75rem] text-gris-claro">{nota}</p>}
    </div>
  );
}

export default function Panel() {
  const [pestana, setPestana] = useState<Estado>("pendiente");
  const [datos, setDatos] = useState<Datos | null>(null);
  const [empleos, setEmpleos] = useState<RespuestaEmpleos | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const cargar = useCallback(async (estado: Estado) => {
    try {
      const r = await fetch(`/api/admin/muro?estado=${estado}`, { cache: "no-store" });
      setDatos(await r.json());
    } catch {
      setDatos({ activo: true, error: "No se pudo cargar. Revisá la conexión." });
    }
  }, []);

  useEffect(() => {
    let vigente = true;
    fetch(`/api/admin/muro?estado=${pestana}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d: Datos) => vigente && setDatos(d))
      .catch(() => vigente && setDatos({ activo: true, error: "No se pudo cargar. Revisá la conexión." }));
    return () => {
      vigente = false;
    };
  }, [pestana]);

  useEffect(() => {
    fetch("/api/empleos")
      .then((r) => r.json())
      .then(setEmpleos)
      .catch(() => {});
  }, []);

  async function accion(id: string, que: "aprobar" | "rechazar" | "borrar" | "limpiar-reportes") {
    if (que === "borrar" && !window.confirm("¿Borrar esta publicación para siempre?")) return;
    setOcupado(id);
    setMensaje(null);
    try {
      const r = await fetch("/api/admin/muro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, accion: que }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setMensaje(
        que === "aprobar"
          ? "Aprobada. Aparece en la página en hasta 1 minuto."
          : que === "rechazar"
            ? "Rechazada. No se va a mostrar."
            : que === "borrar"
              ? "Borrada."
              : "Reportes borrados: vuelve a mostrarse."
      );
      await cargar(pestana);
    } catch (e) {
      setMensaje(e instanceof Error && e.message ? e.message : "No se pudo guardar el cambio.");
    } finally {
      setOcupado(null);
    }
  }

  const c = datos?.cantidades;
  const porRegion = (region: string) => empleos?.ofertas.filter((o) => o.region === region).length ?? "…";

  return (
    <main className="min-h-screen bg-verde-claro">
      <div className="wrap py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[.85rem] font-semibold text-gris">Luis Alberto</p>
            <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] font-extrabold text-verde-oscuro">Panel de control</h1>
          </div>
          <a className="btn btn-linea" href="https://luisalberto.vercel.app" target="_blank" rel="noopener noreferrer">
            Ver la página ↗
          </a>
        </div>

        {/* Resumen */}
        <div className="mt-6 grid grid-cols-2 gap-3 min-[761px]:grid-cols-4">
          <Numero titulo="Ofertas por revisar" valor={c?.pendientes ?? "…"} nota="En el chat del muro" />
          <Numero titulo="Ofertas aprobadas" valor={c?.aprobadas ?? "…"} nota="Se borran solas a los 30 días" />
          <Numero titulo="Empleos en la página" valor={empleos?.ofertas.length ?? "…"} nota={`Argentina ${porRegion("Argentina")} · LATAM ${porRegion("LATAM")} · Global ${porRegion("Global")}`} />
          <Numero
            titulo="Fuentes de empleo"
            valor={empleos ? (empleos.fuentesConError.length ? "Con fallas" : "Todo OK") : "…"}
            nota={empleos?.fuentesConError.length ? `Fallan: ${empleos.fuentesConError.join(", ")}` : "Get on Board, Himalayas, Jobicy"}
          />
        </div>

        {/* Moderación del muro */}
        <section className="mt-8 rounded-tarjeta border border-borde bg-white p-5 shadow-suave min-[561px]:p-6">
          <h2 className="text-[1.25rem] font-extrabold">Muro de ofertas compartidas</h2>
          <p className="mt-1 text-[.88rem] text-gris">
            Abrí cada link antes de aprobarlo. Si pide plata para postularse, es una estafa: rechazala.
          </p>

          <div role="tablist" className="mt-4 flex flex-wrap gap-2">
            {PESTANAS.map((p) => (
              <button
                key={p.valor}
                role="tab"
                type="button"
                aria-selected={pestana === p.valor}
                onClick={() => {
                  setPestana(p.valor);
                  setMensaje(null);
                }}
                className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[.85rem] font-semibold ${
                  pestana === p.valor ? "border-verde bg-verde text-white" : "border-borde bg-white text-verde-oscuro"
                }`}
              >
                {p.texto} {c ? `(${c[p.clave]})` : ""}
              </button>
            ))}
            <button
              type="button"
              onClick={() => cargar(pestana)}
              className="ml-auto cursor-pointer rounded-full border border-borde px-3.5 py-1.5 text-[.85rem] font-semibold text-gris"
            >
              ↻ Actualizar
            </button>
          </div>

          {mensaje && (
            <p role="status" className="mt-4 rounded-[10px] bg-verde-suave px-3.5 py-2.5 text-[.88rem] font-semibold text-verde-oscuro">
              {mensaje}
            </p>
          )}
          {datos?.error && <p className="mt-4 text-[.9rem] font-semibold text-[#a3322a]">{datos.error}</p>}
          {datos && !datos.activo && <p className="mt-4 text-gris">La base de datos del muro no está conectada.</p>}
          {!datos && <p className="mt-4 text-gris">Cargando…</p>}

          {datos?.publicaciones?.length === 0 && (
            <p className="mt-4 rounded-tarjeta border border-dashed border-borde px-4 py-8 text-center text-gris">
              No hay nada acá. 🎉
            </p>
          )}

          <ul className="mt-4 flex flex-col gap-3">
            {datos?.publicaciones?.map((p) => (
              <li key={p.id} className="rounded-xl border border-borde p-4">
                <div className="flex flex-wrap items-center gap-2 text-[.78rem] text-gris">
                  <span className="rounded-md bg-verde-suave px-2 py-0.5 font-bold text-verde-oscuro">{p.dominio}</span>
                  <span>{hace(p.creado)}</span>
                  <span>· {p.estado}</span>
                  {p.reportes > 0 && (
                    <span className="rounded-md bg-aviso-bg px-2 py-0.5 font-bold text-aviso-tx">
                      {p.reportes} {p.reportes === 1 ? "reporte" : "reportes"}
                    </span>
                  )}
                </div>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-2 block text-[.92rem] font-semibold break-all text-[#1c5fa8]"
                >
                  {p.url} ↗
                </a>
                {p.comentario && <p className="mt-1 text-[.9rem]">“{p.comentario}”</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.estado !== "aprobada" && (
                    <button type="button" disabled={ocupado === p.id} onClick={() => accion(p.id, "aprobar")} className="btn btn-verde px-4! py-2! text-[.85rem]!">
                      ✓ Aprobar
                    </button>
                  )}
                  {p.estado !== "rechazada" && (
                    <button type="button" disabled={ocupado === p.id} onClick={() => accion(p.id, "rechazar")} className="btn btn-linea px-4! py-2! text-[.85rem]!">
                      ✕ Rechazar
                    </button>
                  )}
                  {p.reportes > 0 && (
                    <button type="button" disabled={ocupado === p.id} onClick={() => accion(p.id, "limpiar-reportes")} className="btn btn-linea px-4! py-2! text-[.85rem]!">
                      Borrar reportes
                    </button>
                  )}
                  <button type="button" disabled={ocupado === p.id} onClick={() => accion(p.id, "borrar")} className="btn btn-linea px-4! py-2! text-[.85rem]! text-[#a3322a]!">
                    Borrar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Accesos rápidos */}
        <section className="mt-8">
          <h2 className="text-[1.1rem] font-extrabold">Accesos rápidos</h2>
          <p className="mt-1 text-[.85rem] text-gris">
            Las visitas y los países de donde entra la gente se ven en Vercel Analytics (Vercel no deja mostrarlos acá en el plan gratis).
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-2 min-[561px]:grid-cols-2 min-[901px]:grid-cols-3">
            {ACCESOS.map((a) => (
              <li key={a.url}>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-borde bg-white px-4 py-3 text-[.9rem] font-semibold text-verde-oscuro no-underline hover:border-salvia"
                >
                  {a.texto} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
