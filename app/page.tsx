// Página principal: une todas las secciones en el orden de CLAUDE.md.

import Compartir from "@/components/Compartir";
import Empleos from "@/components/empleos/Empleos";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PorQue from "@/components/PorQue";
import Recursos from "@/components/recursos/Recursos";
import Sobre from "@/components/Sobre";
import Toast from "@/components/Toast";
import { muroActivo } from "@/lib/muro/servidor";

export default function Inicio() {
  // ¿Está conectada la base de datos del muro? (se decide en el servidor, sin mostrar claves)
  const activo = muroActivo();
  return (
    <>
      <Header />
      <main id="inicio">
        <Hero muroActivo={activo} />
        <PorQue />
        <Empleos />
        <Compartir muroActivo={activo} />
        <Recursos />
        <Sobre />
      </main>
      <Footer />
      <Toast />
    </>
  );
}
