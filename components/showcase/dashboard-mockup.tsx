import Image from "next/image";

/**
 * Screenshot real do dashboard CFO as Service, já entregue com moldura
 * de MacBook (fundo transparente) — só adicionamos uma sombra de
 * contato suave para "pousar" a tela sobre a cena do hero.
 */
export function DashboardMockup() {
  return (
    <div className="relative w-full max-w-6xl">
      <Image
        src="/media/hero/tela-mac2-2600.webp"
        alt="Painel CFO as Service da Vispe Capital, exibindo receita recorrente, CAC, LTV/CAC, churn, funil comercial e receita por produto"
        width={2600}
        height={1900}
        sizes="(max-width: 809px) 100vw, 1200px"
        className="h-auto w-full drop-shadow-[0_40px_60px_rgba(38,38,38,0.25)]"
        priority
      />
    </div>
  );
}
