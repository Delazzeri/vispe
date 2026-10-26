import Script from "next/script";
import { trackingConfig } from "@/lib/tracking/config";

/**
 * Script do Umami Cloud (estatísticas anônimas, sem cookies; ver lib/tracking/umami.ts).
 * Carrega depois que a página fica ociosa e só conta visitas nos domínios de
 * produção (data-domains), então dev e `pnpm preview` não entram nos números.
 */
export function UmamiScript() {
  const { websiteId, domains } = trackingConfig.umami;
  if (!websiteId) return null;
  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id={websiteId}
      data-domains={domains}
      strategy="lazyOnload"
    />
  );
}
