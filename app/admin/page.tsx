// Panel de control: /admin
// Solo existe en las direcciones privadas de Vercel (ver lib/admin.ts). En la pública da "no encontrado".

import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Panel from "@/components/admin/Panel";
import { hostEsPrivado } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Panel | Luis Alberto",
  robots: { index: false, follow: false },
};

export default async function PaginaPanel() {
  const host = (await headers()).get("host");
  if (!hostEsPrivado(host)) notFound();
  return <Panel />;
}
