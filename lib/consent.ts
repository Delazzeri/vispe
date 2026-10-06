// Consentimento de cookies (LGPD), guardado num cookie próprio do site.
// Scripts opcionais (analytics, pixels) devem checar `readConsent()` e ouvir
// `consentChangeEvent` antes de carregar.

export type ConsentCategory = "analytics" | "marketing";

export type Consent = { version: 1; analytics: boolean; marketing: boolean; updatedAt: string };

const cookieName = "vispe_consent";
const maxAgeSeconds = 60 * 60 * 24 * 365; // 1 ano

/** Disparado em `window` quando a escolha muda (detail: Consent). */
export const consentChangeEvent = "vispe:consent-change";
/** Disparado para reabrir o painel (ex.: link "Preferências de cookies" do footer). */
export const openPreferencesEvent = "vispe:open-cookie-preferences";

function isConsent(value: unknown): value is Consent {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return record.version === 1 && typeof record.analytics === "boolean" && typeof record.marketing === "boolean";
}

/** Escolha salva, ou null se a pessoa ainda não decidiu (ou o cookie é de outra versão). */
export function readConsent(): Consent | null {
  const raw = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${cookieName}=`))
    ?.slice(cookieName.length + 1);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    return isConsent(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: Record<ConsentCategory, boolean>): Consent {
  const consent: Consent = { version: 1, ...choice, updatedAt: new Date().toISOString() };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${cookieName}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent<Consent>(consentChangeEvent, { detail: consent }));
  return consent;
}
