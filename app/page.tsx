// Página principal: une todas las secciones en el orden de CLAUDE.md.

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PorQue from "@/components/PorQue";
import SeccionPendiente from "@/components/SeccionPendiente";

export default function Inicio() {
  return (
    <>
      <Header />
      <main id="inicio">
        <Hero />
        <PorQue />
        {/* Secciones que se construyen en las próximas etapas */}
        <SeccionPendiente id="empleos" titulo="Oportunidades para vos" />
        <SeccionPendiente id="compartir" titulo="Oportunidades que se comparten" />
        <SeccionPendiente id="recursos" titulo="Recursos gratuitos" />
        <SeccionPendiente id="sobre" titulo="Sobre el proyecto" />
      </main>
      <Footer />
    </>
  );
}
