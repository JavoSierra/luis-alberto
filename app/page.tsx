// Página principal: une todas las secciones en el orden de CLAUDE.md.

import Empleos from "@/components/empleos/Empleos";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PorQue from "@/components/PorQue";
import SeccionPendiente from "@/components/SeccionPendiente";
import Toast from "@/components/Toast";

export default function Inicio() {
  return (
    <>
      <Header />
      <main id="inicio">
        <Hero />
        <PorQue />
        {/* Secciones que se construyen en las próximas etapas */}
        <Empleos />
        <SeccionPendiente id="compartir" titulo="Oportunidades que se comparten" />
        <SeccionPendiente id="recursos" titulo="Recursos gratuitos" />
        <SeccionPendiente id="sobre" titulo="Sobre el proyecto" />
      </main>
      <Footer />
      <Toast />
    </>
  );
}
