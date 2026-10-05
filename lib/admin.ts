// Acceso al panel de control (/admin).
//
// El panel NO tiene contraseña propia: solo funciona en las direcciones privadas que genera Vercel
// (terminan en "-javiersierra09-1633.vercel.app"). Vercel las protege con "Deployment Protection":
// para abrirlas hay que iniciar sesión en la cuenta de Vercel del dueño.
// En la dirección pública (luisalberto.vercel.app) el panel no existe (da "página no encontrada").
//
// IMPORTANTE: no desactivar "Deployment Protection" en Vercel (Settings → Deployment Protection),
// porque eso dejaría el panel abierto.

export const DIRECCION_PANEL = "https://luisalberto-git-main-javiersierra09-1633.vercel.app/admin";

const SUFIJO_PRIVADO = "-javiersierra09-1633.vercel.app";

/** ¿El pedido llega por una dirección privada (protegida por Vercel)? */
export function hostEsPrivado(host: string | null): boolean {
  if (!host) return false;
  const nombre = host.toLowerCase().split(":")[0];
  // En la compu, mientras se programa
  if (process.env.NODE_ENV === "development" && (nombre === "localhost" || nombre === "127.0.0.1")) return true;
  return nombre.endsWith(SUFIJO_PRIVADO);
}

/** Para las rutas del panel: dirección privada + pedido hecho desde el mismo panel. */
export function pedidoDelPanel(request: Request): boolean {
  const host = new URL(request.url).host;
  if (!hostEsPrivado(host)) return false;
  if (request.method === "GET") return true;
  const origen = request.headers.get("origin");
  try {
    return !!origen && new URL(origen).host === host;
  } catch {
    return false;
  }
}
