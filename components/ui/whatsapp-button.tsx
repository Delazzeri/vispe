import { whatsappLink } from "@/content/brand";

/** Logo do WhatsApp (glifo oficial do balão com telefone), em SVG inline. */
function WhatsAppLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="currentColor">
      <path d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.3.6 4.54 1.75 6.52L3 29l6.65-1.74A12.95 12.95 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.63c-1.95 0-3.86-.52-5.53-1.51l-.4-.24-3.95 1.03 1.05-3.85-.26-.4A10.6 10.6 0 0 1 5.37 16c0-5.88 4.79-10.66 10.67-10.66 5.87 0 10.64 4.78 10.64 10.66 0 5.88-4.77 10.63-10.64 10.63Zm5.84-7.97c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.09 1.31 3.3c.16.21 2.26 3.45 5.47 4.84.76.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );
}

/**
 * Botão flutuante do WhatsApp (canto inferior direito), em todas as páginas do
 * site. Abre a conversa com uma mensagem já escrita. Some se o número não
 * estiver configurado (brand.social.whatsapp).
 */
export function WhatsAppButton({ labels }: { labels: { label: string; message: string } }) {
  const href = whatsappLink(labels.message);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={labels.label}
      title={labels.label}
      className="fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-paper shadow-[0_8px_24px_-6px_rgba(38,38,38,0.45)] ring-1 ring-ink/10 transition-transform duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-dark motion-safe:hover:scale-105 md:right-6 md:bottom-6 md:h-15 md:w-15"
    >
      <WhatsAppLogo className="h-8 w-8" />
    </a>
  );
}
