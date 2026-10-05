// Pie de página: logo, frase y links a las secciones.

export default function Footer() {
  return (
    <footer className="mt-6 border-t border-borde">
      <div className="wrap flex flex-wrap items-center justify-between gap-4 py-[22px] text-[.85rem] text-gris">
        <div className="flex flex-wrap items-center gap-4">
          <a href="#inicio" className="text-[1.05rem] font-extrabold tracking-[-.03em] text-verde-oscuro no-underline">
            Luis Alberto
          </a>
          <span>Hecho con ganas de ayudar y de construir algo útil.</span>
        </div>
        <nav className="flex flex-wrap items-center gap-[22px]" aria-label="Secciones">
          <a href="#empleos" className="no-underline">Empleos</a>
          <a href="#compartir" className="no-underline">Compartir</a>
          <a href="#recursos" className="no-underline">Recursos</a>
          <a href="#sobre" className="no-underline">Sobre</a>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#3f7a54" aria-hidden="true">
            <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" />
          </svg>
        </nav>
      </div>
    </footer>
  );
}
