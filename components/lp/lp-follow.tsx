import { SocialLogo, type SocialNetwork } from "@/components/ui/social-links";
import { brand } from "@/content/brand";
import type { LpUi } from "@/content/lp-ui";
import { format } from "@/content/types";
import type { LpFollow as LpFollowData } from "@/lib/lp/types";
import { LpButton, LpSectionShell } from "./parts";

const networks: { network: SocialNetwork; label: string }[] = [
  { network: "instagram", label: "Instagram" },
  { network: "linkedin", label: "LinkedIn" },
  { network: "youtube", label: "YouTube" },
  { network: "spotify", label: "Spotify" },
  { network: "facebook", label: "Facebook" },
];

/** Página de obrigado: convite para seguir a Vispe nas redes do site, mais um botão opcional (ex.: grupo do WhatsApp). */
export function LpFollow({ id, data, ui }: { id: string; data: LpFollowData; ui: LpUi }) {
  const links = networks.flatMap(({ network, label }) => {
    const url = brand.social[network];
    return url ? [{ network, label, url }] : [];
  });
  return (
    <LpSectionShell id={id} title={data.title} subtitle={data.text}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {links.map(({ network, label, url }) => (
          <li key={network}>
            <a
              href={url}
              target="_blank"
              rel="noopener"
              aria-label={format(ui.follow.open, { network: label })}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-4 text-base font-semibold text-fg transition-colors hover:border-fg/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
            >
              <SocialLogo network={network} tone="light" />
              {label}
            </a>
          </li>
        ))}
      </ul>
      {/* Botão extra só com destino: sem link ele levaria a um formulário que esta página não tem. */}
      {data.cta.label && data.cta.href.trim() && (
        <div className="mt-8">
          <LpButton cta={data.cta} tone="ink" className="w-full sm:w-auto" />
        </div>
      )}
    </LpSectionShell>
  );
}
