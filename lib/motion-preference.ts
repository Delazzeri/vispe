/**
 * Preferência "Pausar animações" (WCAG 2.2.2): marcada em <html data-motion="paused">,
 * que o CSS das faixas e os vídeos de fundo observam. Salva no navegador só por
 * conveniência — sem ela, tudo volta a animar.
 */
const storageKey = "vispe-motion";
const changeEvent = "vispe:motion-change";

/** Roda antes da pintura (inline no layout) para a faixa não andar e depois parar. */
export const motionInitScript = `try{if(localStorage.getItem("${storageKey}")==="paused")document.documentElement.dataset.motion="paused"}catch(e){}`;

export function isMotionPaused(): boolean {
  return document.documentElement.dataset.motion === "paused";
}

export function setMotionPaused(paused: boolean): void {
  const root = document.documentElement;
  if (paused) root.dataset.motion = "paused";
  else delete root.dataset.motion;
  try {
    localStorage.setItem(storageKey, paused ? "paused" : "running");
  } catch {
    // Armazenamento bloqueado: vale só para esta visita.
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function subscribeMotion(callback: () => void): () => void {
  window.addEventListener(changeEvent, callback);
  return () => window.removeEventListener(changeEvent, callback);
}
