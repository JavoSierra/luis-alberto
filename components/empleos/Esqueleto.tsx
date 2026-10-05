// Tarjeta gris que "late" mientras cargan las ofertas.

export default function Esqueleto() {
  const barra = "rounded-md bg-[#eef1ee]";
  return (
    <div aria-hidden="true" className="flex animate-pulse flex-col gap-2 rounded-tarjeta border border-borde bg-white p-[18px] shadow-suave">
      <div className={`${barra} mb-1.5 h-[42px] w-[42px] rounded-[10px]`} />
      <div className={`${barra} h-4 w-4/5`} />
      <div className={`${barra} h-3 w-1/2`} />
      <div className={`${barra} h-3 w-2/3`} />
      <div className="mt-1 flex gap-1.5">
        <div className={`${barra} h-5 w-16 rounded-full`} />
        <div className={`${barra} h-5 w-14 rounded-full`} />
      </div>
      <div className={`${barra} mt-3 h-[38px] w-full rounded-[10px]`} />
    </div>
  );
}
