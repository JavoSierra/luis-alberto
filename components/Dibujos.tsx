// Dibujos provisorios del prototipo (avatar, hojas, taza).
// Cuando haya imágenes reales en /public/images, se reemplazan acá.

/** Avatar dibujado. Pendiente: reemplazar por foto o ilustración real. */
export function Avatar({ tamano = 40, etiqueta }: { tamano?: number; etiqueta?: string }) {
  return (
    <svg
      className="flex-none rounded-full bg-verde-suave"
      width={tamano}
      height={tamano}
      viewBox="0 0 40 40"
      role={etiqueta ? "img" : undefined}
      aria-label={etiqueta}
      aria-hidden={etiqueta ? undefined : true}
    >
      <circle cx="20" cy="20" r="20" fill="#dfeee2" />
      <circle cx="20" cy="16" r="8" fill="#e8b996" />
      <path d="M11.5 15c0-7 17-7 17 0-2-3-15-3-17 0z" fill="#3a2a20" />
      <path d="M13 18c0 9 14 9 14 0-1 3-13 3-14 0z" fill="#3a2a20" />
      <path d="M6 40c0-10 28-10 28 0z" fill="#3f7a54" />
    </svg>
  );
}

/** Hojas de planta de fondo en el hero. */
export function Hojas() {
  return (
    <>
      <svg className="pointer-events-none absolute -bottom-[30px] -left-[60px] opacity-55" width="220" height="260" viewBox="0 0 220 260" aria-hidden="true">
        <g fill="#a9c4ae">
          <ellipse cx="60" cy="190" rx="34" ry="90" transform="rotate(-28 60 190)" />
          <ellipse cx="120" cy="210" rx="26" ry="76" transform="rotate(18 120 210)" />
          <ellipse cx="20" cy="120" rx="24" ry="70" transform="rotate(-50 20 120)" />
        </g>
      </svg>
      <svg className="pointer-events-none absolute top-[120px] -right-[50px] opacity-55" width="200" height="260" viewBox="0 0 200 260" aria-hidden="true">
        <g fill="#a9c4ae">
          <ellipse cx="140" cy="130" rx="30" ry="84" transform="rotate(30 140 130)" />
          <ellipse cx="170" cy="60" rx="22" ry="60" transform="rotate(52 170 60)" />
          <ellipse cx="110" cy="200" rx="22" ry="62" transform="rotate(-12 110 200)" />
        </g>
      </svg>
    </>
  );
}

/** Pila de libros con frases, al lado de Recursos. */
export function PilaLibros() {
  const libro =
    "rounded-[3px_6px_6px_3px] border-r-[10px] border-[#f3f0e6] px-3 py-[7px] text-[.82rem] font-bold text-verde-oscuro shadow-[0_2px_3px_rgba(31,61,43,.12)]";
  return (
    <div className="flex w-[180px] -rotate-[4deg] flex-col gap-[3px]">
      <span className={`${libro} bg-salvia`}>Mejor CV</span>
      <span className={`${libro} ml-2.5 bg-[#bcd3bf]`}>Más entrevistas</span>
      <span className={`${libro} -ml-1 bg-[#98b79e]`}>Nuevas oportunidades</span>
    </div>
  );
}

/** Taza con texto, al lado del chat. Solo en pantallas grandes (desde 1024px). */
export function Taza() {
  return (
    <div
      aria-hidden="true"
      className="absolute -right-1.5 -bottom-[34px] z-[2] hidden h-[92px] w-[86px] rounded-[8px_8px_18px_18px] pt-[26px] pl-3 text-[.66rem] leading-[1.3] font-bold text-verde-oscuro shadow-suave lg:block"
      style={{ background: "linear-gradient(90deg,#fff,#eef1ec)" }}
    >
      Trabajo
      <br />
      Personas
      <br />
      Propósito &lt;3
      {/* Manija */}
      <span className="absolute top-[22px] -right-5 h-[38px] w-[26px] rounded-[0_18px_18px_0] border-[7px] border-l-0 border-[#eef1ec]" />
    </div>
  );
}
