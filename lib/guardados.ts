"use client";

// Ofertas guardadas: viven solo en el navegador de cada persona (localStorage).
// Todo va envuelto en try/catch porque en modo incógnito o con el almacenamiento bloqueado puede fallar.

import { useSyncExternalStore } from "react";

const CLAVE = "la-guardados";
const EVENTO = "la-guardados-cambio";

// Lista vacía fija, para que React no crea que cambió en cada lectura
const VACIA: string[] = [];
let cache: { texto: string | null; lista: string[] } = { texto: null, lista: VACIA };

function leer(): string[] {
  try {
    const texto = localStorage.getItem(CLAVE);
    if (texto === cache.texto) return cache.lista;
    const lista = JSON.parse(texto || "[]");
    cache = { texto, lista: Array.isArray(lista) ? lista.map(String) : VACIA };
  } catch {
    cache = { texto: null, lista: VACIA };
  }
  return cache.lista;
}

function escribir(lista: string[]) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
  } catch {
    // Si no se puede guardar, la página sigue funcionando igual
  }
  window.dispatchEvent(new Event(EVENTO));
}

function suscribir(avisar: () => void) {
  window.addEventListener(EVENTO, avisar);
  window.addEventListener("storage", avisar); // cambios hechos en otra pestaña
  return () => {
    window.removeEventListener(EVENTO, avisar);
    window.removeEventListener("storage", avisar);
  };
}

/** Devuelve la lista de ids guardados y se actualiza sola cuando cambia. */
export function useGuardados(): string[] {
  return useSyncExternalStore(suscribir, leer, () => VACIA);
}

/** Agrega o quita una oferta. Devuelve true si quedó guardada. */
export function alternarGuardado(id: string): boolean {
  const lista = leer();
  const guardada = lista.includes(id);
  escribir(guardada ? lista.filter((x) => x !== id) : [...lista, id]);
  return !guardada;
}

// Aviso para que la sección Empleos active el filtro "Guardados"
export const EVENTO_VER_GUARDADOS = "la-ver-guardados";
