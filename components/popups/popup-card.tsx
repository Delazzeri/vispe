import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Popup } from "@/lib/popups/rules";

export type PopupContent = Pick<
  Popup,
  "layout" | "image_url" | "image_alt" | "image_width" | "image_height" | "title" | "body" | "cta_label" | "cta_url" | "cta_new_tab"
>;

type PopupCardProps = {
  popup: PopupContent;
  headingId: string;
  closeLabel: string;
  onClose?: () => void;
  onCta?: () => void;
};

/**
 * Visual do pop-up (o mesmo no site e na prévia do admin): imagem, título,
 * texto e botão, com o X de fechar no canto. Quem posiciona é quem usa.
 */
export function PopupCard({ popup, headingId, closeLabel, onClose, onCta }: PopupCardProps) {
  const corner = popup.layout === "corner";
  const hasText = Boolean(popup.title || popup.body || popup.cta_label);
  const width = popup.image_width ?? 1200;
  const height = popup.image_height ?? 630;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-surface text-fg shadow-[0_24px_64px_-16px_rgba(38,38,38,0.45)]",
        corner ? "w-full max-w-sm" : "w-full max-w-md",
      )}
    >
      {popup.image_url &&
        (popup.cta_url && !hasText ? (
          // Pop-up só de imagem: a imagem inteira é o link.
          <a
            href={popup.cta_url}
            target={popup.cta_new_tab ? "_blank" : undefined}
            rel={popup.cta_new_tab ? "noopener" : undefined}
            onClick={onCta}
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-dark"
          >
            <Image src={popup.image_url} alt={popup.image_alt} width={width} height={height} sizes="(min-width: 640px) 448px, 100vw" className="h-auto w-full" />
          </a>
        ) : (
          <Image src={popup.image_url} alt={popup.image_alt} width={width} height={height} sizes="(min-width: 640px) 448px, 100vw" className="h-auto w-full" />
        ))}

      {hasText && (
        <div className={cn(corner ? "p-5" : "p-6")}>
          {popup.title && (
            <h2 id={headingId} className={cn("pr-8 font-bold tracking-tight text-fg", corner ? "text-lg" : "text-xl md:text-2xl")}>
              {popup.title}
            </h2>
          )}
          {popup.body && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-fg-muted">{popup.body}</p>}
          {popup.cta_label && popup.cta_url && (
            <a
              href={popup.cta_url}
              target={popup.cta_new_tab ? "_blank" : undefined}
              rel={popup.cta_new_tab ? "noopener" : undefined}
              onClick={onCta}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg transition-colors hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              {popup.cta_label}
            </a>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-fg shadow-sm ring-1 ring-border transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
      >
        <X aria-hidden className="h-4 w-4" />
      </button>
    </div>
  );
}
