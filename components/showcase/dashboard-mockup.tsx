import Image from "next/image";
import { useSite } from "@/content/site";

/**
 * Screenshot real do dashboard CFO as Service, já entregue com moldura
 * de MacBook (fundo transparente) — só adicionamos uma sombra de
 * contato suave para "pousar" a tela sobre a cena do hero.
 */
export function DashboardMockup() {
  const { ui } = useSite();
  return (
    <div className="relative w-full max-w-6xl">
      <Image
        src="/media/hero/tela-mac-3-2600.webp"
        alt={ui.dashboardAlt}
        width={2600}
        height={1900}
        sizes="(max-width: 809px) 100vw, 1200px"
        className="h-auto w-full drop-shadow-[0_40px_60px_rgba(38,38,38,0.25)]"
        priority
      />
    </div>
  );
}
