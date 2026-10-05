// Pide datos JSON a una fuente con tiempo límite.
// Si la fuente tarda demasiado o responde con error, lanza una excepción y esa fuente se marca como caída.

const TIEMPO_LIMITE_MS = 12_000;

export async function pedirJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "LuisAlberto/1.0 (pagina de empleos sin fines de lucro)" },
    signal: AbortSignal.timeout(TIEMPO_LIMITE_MS),
    // La caché la maneja la ruta /api/empleos (varias horas). Acá no se guarda nada.
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${url} respondió ${res.status}`);
  return (await res.json()) as T;
}
