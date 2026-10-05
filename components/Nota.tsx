// Nota manuscrita inclinada (letra Caveat) con un trazo dibujado a mano en SVG.

type Trazo = "largo" | "corto" | "curva" | "ninguno";

type Props = {
  children: React.ReactNode;
  trazo?: Trazo;
  giro?: number; // inclinación en grados (el prototipo usa -6 por defecto)
  className?: string;
};

export default function Nota({ children, trazo = "corto", giro = -6, className = "" }: Props) {
  return (
    <span className={`nota ${className}`} style={{ transform: `rotate(${giro}deg)` }}>
      {children}
      {trazo === "largo" && (
        <svg width="110" height="12" viewBox="0 0 110 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M3 8c30-6 70-6 104-2" />
        </svg>
      )}
      {trazo === "corto" && (
        <svg width="90" height="10" viewBox="0 0 90 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M3 7c25-5 55-5 84-2" />
        </svg>
      )}
      {trazo === "curva" && (
        <svg width="46" height="44" viewBox="0 0 46 44" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M38 3c4 10-2 16-9 13-5-2-2-9 3-6 6 4-4 20-24 26" />
          <path d="M8 26v10h10" />
        </svg>
      )}
    </span>
  );
}
