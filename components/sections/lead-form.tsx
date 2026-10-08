"use client";

import { useEffect, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { ArrowRight, CircleAlert, CircleCheck } from "lucide-react";
import { submitLead, type LeadField, type LeadState } from "@/app/[locale]/(site)/contato/actions";
import type { SiteContent } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { leadAnchor } from "@/lib/lead";

type LeadFormProps = {
  locale: Locale;
  copy: SiteContent["contact"]["form"];
  messages: SiteContent["contact"]["messages"];
  /** Opções de interesse: pilares + "ainda não sei". */
  interests: readonly { value: string; label: string }[];
  /** Exibido quando o envio pelo site ainda não está disponível (ex.: redes da Vispe). */
  fallback: ReactNode;
};

const inputClass =
  "mt-2 block w-full rounded-xl border border-border bg-bg/60 px-4 py-3 text-base text-fg placeholder:text-fg-muted transition-colors focus:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark aria-invalid:border-brand-dark";

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-brand-dark">
          <CircleAlert className="h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

/** Interesse pré-selecionado pela âncora "#diagnostico-<pilar>" (CTAs dos pilares). */
function interestFromHash(values: readonly string[]) {
  const prefix = `#${leadAnchor}-`;
  const hash = window.location.hash;
  if (!hash.startsWith(prefix)) return undefined;
  const value = decodeURIComponent(hash.slice(prefix.length));
  return values.includes(value) ? value : undefined;
}

export function LeadForm({ locale, copy, messages, interests, fallback }: LeadFormProps) {
  const [state, setState] = useState<LeadState>({ status: "idle" });
  const [interest, setInterest] = useState<string>();
  const [pending, startTransition] = useTransition();
  const { fields } = copy;

  useEffect(() => {
    const values = interests.map((option) => option.value);
    const sync = () => {
      const fromHash = interestFromHash(values);
      if (fromHash) setInterest(fromHash);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [interests]);

  const errors: Partial<Record<LeadField, string>> = state.status === "invalid" ? state.errors : {};
  const a11y = (field: LeadField) => ({
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `lead-${field}-error` : undefined,
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    // Sem reset automático: em caso de erro, o que foi digitado fica.
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await submitLead(state, formData);
      setState(result);
      if (result.status === "success") form.reset();
    });
  }

  if (state.status === "success") {
    return (
      <div role="status" className="flex items-start gap-3 rounded-2xl bg-accent-soft/40 p-6">
        <CircleCheck className="mt-0.5 h-6 w-6 shrink-0 text-brand-dark" aria-hidden />
        <p className="text-base text-fg">{messages.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot: fora da tela e do Tab; robôs costumam preencher. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div aria-live="polite">
        {state.status === "invalid" && (
          <p className="flex items-center gap-2 rounded-xl bg-accent-soft/40 px-4 py-3 text-sm font-medium text-fg">
            <CircleAlert className="h-4 w-4 shrink-0 text-brand-dark" aria-hidden />
            {messages.invalid}
          </p>
        )}
        {state.status === "unavailable" && (
          <div className="rounded-xl bg-accent-soft/40 px-4 py-3 text-sm text-fg">
            <p>{messages.unavailable}</p>
            <div className="mt-3">{fallback}</div>
          </div>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field id="lead-name" label={fields.name} error={errors.name} className="md:col-span-2">
          <input id="lead-name" name="name" type="text" autoComplete="name" required className={inputClass} {...a11y("name")} />
        </Field>
        <Field id="lead-email" label={fields.email} error={errors.email}>
          <input id="lead-email" name="email" type="email" autoComplete="email" required className={inputClass} {...a11y("email")} />
        </Field>
        <Field id="lead-phone" label={fields.phone} error={errors.phone}>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(00) 00000-0000"
            required
            className={inputClass}
            {...a11y("phone")}
          />
        </Field>
        <Field id="lead-company" label={fields.company} error={errors.company}>
          <input id="lead-company" name="company" type="text" autoComplete="organization" required className={inputClass} {...a11y("company")} />
        </Field>
        <Field id="lead-segment" label={fields.segment} error={errors.segment}>
          <input id="lead-segment" name="segment" type="text" required className={inputClass} {...a11y("segment")} />
        </Field>
        <Field id="lead-revenue" label={fields.revenue} error={errors.revenue} className="md:col-span-2">
          <select id="lead-revenue" name="revenue" required defaultValue="" className={inputClass} {...a11y("revenue")}>
            <option value="" disabled>
              {copy.revenuePlaceholder}
            </option>
            {copy.revenueOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div>
        <p id="lead-interest-label" className="text-sm font-medium text-fg">
          {fields.interest}
        </p>
        <div
          role="radiogroup"
          aria-labelledby="lead-interest-label"
          {...a11y("interest")}
          className="mt-3 flex flex-wrap gap-2"
        >
          {interests.map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input
                type="radio"
                name="interest"
                value={option.value}
                required
                checked={interest === option.value}
                onChange={() => setInterest(option.value)}
                className="peer sr-only"
              />
              <span className="inline-flex rounded-lg border border-border bg-bg/60 px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-fg/30 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:ring-2 peer-focus-visible:ring-brand-dark peer-focus-visible:ring-offset-2">
                {option.label}
              </span>
            </label>
          ))}
        </div>
        {errors.interest && (
          <p id="lead-interest-error" className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-brand-dark">
            <CircleAlert className="h-4 w-4 shrink-0" aria-hidden />
            {errors.interest}
          </p>
        )}
      </div>

      <Field id="lead-message" label={fields.message}>
        <textarea id="lead-message" name="message" rows={3} maxLength={2000} className={cn(inputClass, "resize-y")} />
      </Field>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-fg-muted">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-0.5 h-4 w-4 shrink-0 accent-ink"
            {...a11y("consent")}
          />
          <span>{copy.consent}</span>
        </label>
        {errors.consent && (
          <p id="lead-consent-error" className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-brand-dark">
            <CircleAlert className="h-4 w-4 shrink-0" aria-hidden />
            {errors.consent}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-7 py-4 text-base font-semibold text-paper transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark disabled:opacity-60 md:w-auto md:text-sm"
      >
        {pending ? copy.sending : copy.submit}
        {!pending && <ArrowRight className="h-4 w-4" aria-hidden />}
      </button>
    </form>
  );
}
