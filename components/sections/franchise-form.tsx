"use client";

import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import { ArrowRight, CircleAlert, CircleCheck } from "lucide-react";
import {
  submitFranchise,
  type FranchiseField,
  type FranchiseState,
} from "@/app/[locale]/(site)/franquia/actions";
import { ConsentField, Field, fieldA11y, Honeypot, inputClass } from "@/components/ui/form-field";
import type { FranchiseContent } from "@/content/franchise";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

type FranchiseFormProps = {
  locale: Locale;
  copy: FranchiseContent["form"];
  messages: FranchiseContent["messages"];
  /** Exibido quando o envio pelo site ainda não está disponível (ex.: redes da Vispe). */
  fallback: ReactNode;
};

export function FranchiseForm({ locale, copy, messages, fallback }: FranchiseFormProps) {
  const [state, setState] = useState<FranchiseState>({ status: "idle" });
  const [pending, startTransition] = useTransition();
  const { fields } = copy;

  const errors: Partial<Record<FranchiseField, string>> = state.status === "invalid" ? state.errors : {};
  const a11y = (field: FranchiseField) => fieldA11y(`franchise-${field}`, errors[field]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await submitFranchise(state, formData);
      setState(result);
      if (result.status === "success") form.reset();
    });
  }

  if (state.status === "success") {
    return (
      <div role="status" className="mt-8 flex items-start gap-3 rounded-2xl bg-accent-soft/40 p-6">
        <CircleCheck className="mt-0.5 h-6 w-6 shrink-0 text-brand-dark" aria-hidden />
        <p className="text-base text-fg">{messages.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative mt-8 space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <Honeypot />

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
        <Field id="franchise-name" label={fields.name} error={errors.name} className="md:col-span-2">
          <input id="franchise-name" name="name" type="text" autoComplete="name" required className={inputClass} {...a11y("name")} />
        </Field>
        <Field id="franchise-email" label={fields.email} error={errors.email}>
          <input id="franchise-email" name="email" type="email" autoComplete="email" required className={inputClass} {...a11y("email")} />
        </Field>
        <Field id="franchise-phone" label={fields.phone} error={errors.phone}>
          <input
            id="franchise-phone"
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
        <Field id="franchise-city" label={fields.city} error={errors.city}>
          <input id="franchise-city" name="city" type="text" autoComplete="address-level2" required className={inputClass} {...a11y("city")} />
        </Field>
        <Field id="franchise-background" label={fields.background} error={errors.background}>
          <input id="franchise-background" name="background" type="text" required className={inputClass} {...a11y("background")} />
        </Field>
        <Field id="franchise-capital" label={fields.capital} error={errors.capital} className="md:col-span-2">
          <select id="franchise-capital" name="capital" required defaultValue="" className={inputClass} {...a11y("capital")}>
            <option value="" disabled>
              {copy.capitalPlaceholder}
            </option>
            {copy.capitalOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
        <Field id="franchise-message" label={fields.message} className="md:col-span-2">
          <textarea id="franchise-message" name="message" rows={3} maxLength={2000} className={cn(inputClass, "resize-y")} />
        </Field>
      </div>

      <ConsentField id="franchise-consent" label={copy.consent} error={errors.consent} />

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
