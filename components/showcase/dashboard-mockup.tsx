import Image from "next/image";

/**
 * Moldura em vidro (estilo macOS/visionOS Liquid Glass) ao redor do
 * screenshot real do dashboard CFO as Service — equivalente ao
 * ".cd-hero__desktop" do cooldock.app (blur + borda de luz + sombras
 * internas simulando reflexo), adaptado aos tokens da Vispe.
 */
export function DashboardMockup() {
  return (
    <div
      className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/60 bg-white/40 p-2 backdrop-blur-2xl"
      style={{
        boxShadow:
          "inset 0 1px 1px rgba(255,255,255,0.8), inset 0 -12px 24px rgba(255,255,255,0.4), 0 40px 80px -24px rgba(38,38,38,0.35), 0 12px 24px -8px rgba(38,38,38,0.2)",
      }}
    >
      <div className="relative overflow-hidden rounded-[20px]">
        <Image
          src="/media/hero/dashboard-2000.webp"
          alt="Painel CFO as Service da Vispe Capital, exibindo receita recorrente, CAC, LTV/CAC, churn, funil comercial e receita por produto"
          width={2000}
          height={1239}
          sizes="(max-width: 809px) 100vw, 900px"
          className="h-auto w-full"
          priority
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[28px] border border-white/70"
      />
    </div>
  );
}
