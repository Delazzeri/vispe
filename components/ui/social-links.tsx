import Image from "next/image";
import { brand, useSite } from "@/content/site";
import { format } from "@/content/types";
import { cn } from "@/lib/cn";

type SocialNetwork = "instagram" | "facebook" | "linkedin" | "spotify" | "youtube";

const socialNetworks: { network: SocialNetwork; label: string }[] = [
  { network: "instagram", label: "Instagram" },
  { network: "facebook", label: "Facebook" },
  { network: "linkedin", label: "LinkedIn" },
  { network: "spotify", label: "Spotify" },
  { network: "youtube", label: "YouTube" },
];

type Tone = "light" | "dark";

/**
 * Versão monocromática do logo (gerada a partir do PNG colorido) sempre
 * visível; a versão colorida oficial entra por opacidade no hover/foco.
 * Em fundo escuro, a versão preta é invertida (círculo branco).
 */
function SocialLogo({ network, tone }: { network: SocialNetwork; tone: Tone }) {
  return (
    <span aria-hidden className="relative block h-6 w-6">
      <Image
        src={`/media/social/${network}-black-192.png`}
        alt=""
        width={24}
        height={24}
        className={cn("h-6 w-6", tone === "dark" ? "opacity-70 invert" : "opacity-60")}
      />
      <Image
        src={`/media/social/${network}.png`}
        alt=""
        width={24}
        height={24}
        className="absolute inset-0 h-6 w-6 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
    </span>
  );
}

/** Logos das redes da Vispe (URLs em content/brand.ts:social). */
export function SocialLinks({ tone = "light", className }: { tone?: Tone; className?: string }) {
  const { ui } = useSite();
  return (
    <ul className={cn("flex gap-3", className)}>
      {socialNetworks.map(({ network, label }) => {
        const url = brand.social[network];
        const name = format(ui.socialProfile, { network: label });
        return (
          <li key={network}>
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener"
                aria-label={name}
                className={cn(
                  "group block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  tone === "dark"
                    ? "focus-visible:ring-brand focus-visible:ring-offset-ink"
                    : "focus-visible:ring-brand-dark",
                )}
              >
                <SocialLogo network={network} tone={tone} />
              </a>
            ) : (
              // TODO(content): sem URL oficial ainda — logo sem link.
              <span role="img" aria-label={name} title={name} className="group block">
                <SocialLogo network={network} tone={tone} />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
