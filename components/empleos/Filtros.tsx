"use client";

// Barra de filtros: buscador, Categoría, Región, interruptor "Remoto" e interruptor "Guardados".

export type FiltroRegion = "apto" | "Argentina" | "LATAM" | "Global" | "todas";

export type ValoresFiltros = {
  q: string;
  categoria: string;
  region: FiltroRegion;
  remoto: boolean;
  guardados: boolean;
};

type Props = {
  valores: ValoresFiltros;
  categorias: string[];
  cambiar: (nuevos: Partial<ValoresFiltros>) => void;
};

export default function Filtros({ valores, categorias, cambiar }: Props) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-3 min-[481px]:grid-cols-2 min-[901px]:grid-cols-[2fr_1fr_1fr_auto_auto]">
      <input
        className="campo min-w-0 min-[481px]:col-span-2 min-[901px]:col-span-1"
        type="search"
        placeholder="Buscar empleos por título, empresa o palabra clave..."
        aria-label="Buscar empleos"
        value={valores.q}
        onChange={(e) => cambiar({ q: e.target.value })}
      />
      <select
        className="campo min-w-0"
        aria-label="Categoría"
        value={valores.categoria}
        onChange={(e) => cambiar({ categoria: e.target.value })}
      >
        <option value="">Categoría</option>
        {categorias.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        className="campo min-w-0"
        aria-label="Región"
        value={valores.region}
        onChange={(e) => cambiar({ region: e.target.value as FiltroRegion })}
      >
        <option value="apto">Argentina y LATAM (todo lo que puedo aplicar)</option>
        <option value="Argentina">Solo Argentina</option>
        <option value="LATAM">Solo remoto LATAM</option>
        <option value="Global">Solo remoto global</option>
        <option value="todas">Todas, incluso otras regiones</option>
      </select>
      <label className="sw">
        Remoto
        <input type="checkbox" checked={valores.remoto} onChange={(e) => cambiar({ remoto: e.target.checked })} />
      </label>
      <label className="sw">
        Guardados
        <input type="checkbox" checked={valores.guardados} onChange={(e) => cambiar({ guardados: e.target.checked })} />
      </label>
    </div>
  );
}
