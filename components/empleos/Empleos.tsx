"use client";

// Sección "Oportunidades para vos": pide las ofertas a /api/empleos y las muestra con filtros.

import { useEffect, useMemo, useState } from "react";
import { avisar } from "@/components/Toast";
import { alternarGuardado, EVENTO_VER_GUARDADOS, useGuardados } from "@/lib/guardados";
import type { Oferta, RespuestaEmpleos } from "@/lib/empleos/tipos";
import Esqueleto from "./Esqueleto";
import Filtros, { type ValoresFiltros } from "./Filtros";
import TarjetaEmpleo from "./TarjetaEmpleo";

const POR_TANDA = 8;

const INICIALES: ValoresFiltros = { q: "", categoria: "", region: "apto", remoto: false, guardados: false };

// Aplica los filtros a una oferta
function pasa(o: Oferta, f: ValoresFiltros, guardados: string[]): boolean {
  const q = f.q.trim().toLowerCase();
  if (q && !`${o.titulo} ${o.empresa} ${o.categoria} ${o.ubicacion}`.toLowerCase().includes(q)) return false;
  if (f.categoria && o.categoria !== f.categoria) return false;
  // Región: "apto" = todo lo que se puede aplicar desde Argentina (oculta "Otras")
  if (f.region === "apto" && o.region === "Otras") return false;
  if (f.region === "Argentina" && o.region !== "Argentina") return false;
  // "Solo remoto LATAM" y "Solo remoto global": además de la región, tiene que ser remoto
  if ((f.region === "LATAM" || f.region === "Global") && (o.region !== f.region || o.modalidad !== "Remoto")) return false;
  if (f.remoto && o.modalidad !== "Remoto") return false;
  if (f.guardados && !guardados.includes(o.id)) return false;
  return true;
}

export default function Empleos() {
  const [datos, setDatos] = useState<RespuestaEmpleos | null>(null);
  const [errorCarga, setErrorCarga] = useState(false);
  const [filtros, setFiltros] = useState<ValoresFiltros>(INICIALES);
  const [mostrar, setMostrar] = useState(POR_TANDA);
  const guardados = useGuardados();

  // Pide las ofertas al servidor una vez, al abrir la página
  useEffect(() => {
    fetch("/api/empleos")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<RespuestaEmpleos>;
      })
      .then(setDatos)
      .catch(() => setErrorCarga(true));
  }, []);

  // "Mis ofertas guardadas" del menú del header activa el filtro Guardados
  useEffect(() => {
    function verGuardados() {
      setFiltros((f) => ({ ...f, guardados: true }));
      setMostrar(POR_TANDA);
    }
    window.addEventListener(EVENTO_VER_GUARDADOS, verGuardados);
    return () => window.removeEventListener(EVENTO_VER_GUARDADOS, verGuardados);
  }, []);

  const categorias = useMemo(
    () => [...new Set((datos?.ofertas ?? []).map((o) => o.categoria))].sort((a, b) => a.localeCompare(b, "es")),
    [datos]
  );

  const lista = useMemo(
    () => (datos?.ofertas ?? []).filter((o) => pasa(o, filtros, guardados)),
    [datos, filtros, guardados]
  );

  function cambiar(nuevos: Partial<ValoresFiltros>) {
    setFiltros((f) => ({ ...f, ...nuevos }));
    setMostrar(POR_TANDA);
  }

  function guardar(id: string) {
    avisar(alternarGuardado(id) ? "Oferta guardada" : "Oferta quitada de guardados");
  }

  const cargando = !datos && !errorCarga;
  const hayAviso = errorCarga || (datos?.fuentesConError.length ?? 0) > 0;

  return (
    <section id="empleos" className="py-11">
      <div className="wrap">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[clamp(1.6rem,4vw,2rem)] font-extrabold">Oportunidades para vos</h2>
            <p className="mt-0.5 text-gris">Empleos para postularte desde Argentina y LATAM, en un solo lugar.</p>
          </div>
          {hayAviso && (
            <span className="rounded-[10px] bg-aviso-bg px-3.5 py-2 text-[.82rem] font-semibold text-aviso-tx">
              Algunas fuentes pueden estar temporalmente fuera de línea.
            </span>
          )}
        </div>

        <Filtros valores={filtros} categorias={categorias} cambiar={cambiar} />

        <div className="grid grid-cols-1 gap-4 min-[561px]:grid-cols-2 min-[1001px]:grid-cols-4" aria-busy={cargando}>
          {cargando && Array.from({ length: POR_TANDA }, (_, i) => <Esqueleto key={i} />)}

          {!cargando && lista.length === 0 && (
            <div className="col-span-full rounded-tarjeta border border-dashed border-borde px-4 py-10 text-center text-gris">
              {errorCarga
                ? "No pudimos cargar las ofertas. Probá de nuevo en un rato."
                : filtros.guardados && guardados.length === 0
                  ? "Todavía no guardaste ninguna oferta. Tocá el marcador de una tarjeta para guardarla."
                  : "No encontramos ofertas con esos filtros. Probá con otra palabra o sacá algún filtro."}
            </div>
          )}

          {lista.slice(0, mostrar).map((o) => (
            <TarjetaEmpleo key={o.id} oferta={o} guardada={guardados.includes(o.id)} alGuardar={() => guardar(o.id)} />
          ))}
        </div>

        <div className="mt-[18px] flex flex-wrap items-center justify-between gap-3">
          <small className="text-[.8rem] text-gris-claro">
            {lista.length > 0 && `Mostrando ${Math.min(mostrar, lista.length)} de ${lista.length} ofertas`}
          </small>
          {lista.length > mostrar && (
            <button
              type="button"
              onClick={() => setMostrar((m) => m + POR_TANDA)}
              className="cursor-pointer text-[.92rem] font-bold text-verde"
            >
              Ver más oportunidades →
            </button>
          )}
        </div>

        {/* Atribución a las fuentes (lo exigen sus condiciones de uso) */}
        <p className="mt-4 text-[.78rem] text-gris-claro">
          Ofertas de{" "}
          <a href="https://www.getonbrd.com" target="_blank" rel="noopener noreferrer" className="underline">Get on Board</a>,{" "}
          <a href="https://himalayas.app" target="_blank" rel="noopener noreferrer" className="underline">Himalayas</a> y{" "}
          <a href="https://jobicy.com" target="_blank" rel="noopener noreferrer" className="underline">Jobicy</a>.
          Cada botón te lleva a la publicación original.
        </p>
      </div>
    </section>
  );
}
