// Lugar reservado para una sección que todavía no está hecha.
// Sirve para que los links del menú ya lleven a algún lado. Se borra cuando la sección real esté lista.

export default function SeccionPendiente({ id, titulo }: { id: string; titulo: string }) {
  return (
    <section id={id} className="py-11">
      <div className="wrap">
        <h2 className="text-[clamp(1.6rem,4vw,2rem)] font-extrabold">{titulo}</h2>
        <p className="mt-3 rounded-tarjeta border border-dashed border-borde px-4 py-10 text-center text-gris">
          Esta sección está en construcción.
        </p>
      </div>
    </section>
  );
}
