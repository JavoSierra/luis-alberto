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

export default function Inicio() {
  return (
    <>
      <Header />
      <main id="inicio">
        <Hero />
        <PorQue />
        <Empleos />
        <Compartir />
        <Recursos />
        <Sobre />
      </main>
      <Footer />
      <Toast />
    </>
  );
}
