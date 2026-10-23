"use client";

import { useEffect, useState } from "react";
import type { LpUi } from "@/content/lp-ui";
import type { LpCountdown as LpCountdownData } from "@/lib/lp/types";
import { LpButton, LpHeading } from "./parts";

/** "2026-11-20T19:00" no horário de Brasília (UTC-3) → instante; inválido: undefined. */
function targetTime(value: string): number | undefined {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?$/);
  if (!match) return undefined;
  const [, y, m, d, hh = "00", mm = "00"] = match;
  const time = Date.parse(`${y}-${m}-${d}T${hh}:${mm}:00-03:00`);
  return Number.isNaN(time) ? undefined : time;
}

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Contagem regressiva até a data do admin. No servidor (e antes do mount) mostra
 * traços, para o HTML estático não ficar com um número velho nem divergir da
 * hidratação; depois do mount atualiza a cada segundo.
 */
export function LpCountdown({ id, data, ui }: { id: string; data: LpCountdownData; ui: LpUi }) {
  const target = targetTime(data.target);
  const [now, setNow] = useState<number>();

  useEffect(() => {
    if (target === undefined) return;
    const tick = () => setNow(Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  if (target === undefined) return null;
  const left = now === undefined ? undefined : Math.max(0, target - now);
  const ended = left === 0;
  const units: [string, number | undefined][] = [
    [ui.countdown.days, left === undefined ? undefined : Math.floor(left / 86_400_000)],
    [ui.countdown.hours, left === undefined ? undefined : Math.floor(left / 3_600_000) % 24],
    [ui.countdown.minutes, left === undefined ? undefined : Math.floor(left / 60_000) % 60],
    [ui.countdown.seconds, left === undefined ? undefined : Math.floor(left / 1000) % 60],
  ];
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="bg-bg py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <LpHeading id={headingId}>{ended && data.expiredText ? data.expiredText : data.title}</LpHeading>
          {data.text && !ended && <p className="mt-4 max-w-md text-lg leading-relaxed text-fg-muted">{data.text}</p>}
          {data.cta.label && !ended && (
            <div className="mt-8">
              <LpButton cta={data.cta} className="w-full sm:w-auto" />
            </div>
          )}
        </div>
        {!ended && (
          // role="timer" sem aria-live: o leitor de tela não anuncia a contagem a cada segundo.
          <div role="timer" aria-label={ui.countdown.label} className="md:col-span-7">
            <dl className="grid grid-cols-4 gap-2 sm:gap-4">
              {units.map(([label, value]) => (
                // dt antes de dd no HTML (exigência do <dl>); flex-col-reverse põe o número em cima.
                <div key={label} className="flex flex-col-reverse rounded-2xl bg-ink px-2 py-5 text-center text-paper sm:py-7">
                  <dt className="mt-1 text-xs text-paper/70 sm:text-sm">{label}</dt>
                  <dd className="text-4xl font-bold tabular-nums sm:text-6xl" style={{ letterSpacing: "-0.04em" }}>
                    {value === undefined ? "--" : pad(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}
