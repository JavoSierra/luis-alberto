// Conexión con la base de datos del muro (Supabase). SOLO se usa en el servidor:
// la clave secreta nunca llega al navegador.
//
// Las variables de entorno las crea sola la integración de Supabase en Vercel.
// Si no están, el muro queda apagado y el chat muestra "Próximamente".

import { createHmac } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function variables() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && clave ? { url, clave } : null;
}

/** ¿Está conectada la base de datos? */
export function muroActivo(): boolean {
  return variables() !== null;
}

let cliente: SupabaseClient | null = null;

export function baseDeDatos(): SupabaseClient {
  const v = variables();
  if (!v) throw new Error("Faltan las variables de entorno de Supabase");
  cliente ??= createClient(v.url, v.clave, { auth: { persistSession: false, autoRefreshToken: false } });
  return cliente;
}

/** IP de quien hace el pedido (Vercel la pasa en estos encabezados). */
export function ipDe(request: Request): string {
  const reenviada = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return reenviada || request.headers.get("x-real-ip") || "desconocida";
}

/**
 * Convierte la IP en un código irreversible (hash con clave secreta).
 * Así se puede limitar cuántas veces publica alguien sin guardar nunca su IP real.
 */
export function hashIp(ip: string): string {
  const secreto = variables()?.clave ?? "sin-clave";
  return createHmac("sha256", secreto).update(`muro:${ip}`).digest("hex");
}

/**
 * Solo se aceptan publicaciones enviadas desde la propia página.
 * Evita que otro sitio use los navegadores de sus visitantes para llenar el muro de spam.
 */
export function desdeLaPagina(request: Request): boolean {
  const origen = request.headers.get("origin");
  if (!origen) return false;
  try {
    return new URL(origen).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
