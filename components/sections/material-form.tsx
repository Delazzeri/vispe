"use client";

import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import { CircleAlert, CircleCheck, Download } from "lucide-react";
import {
  requestMaterial,
  type MaterialField,
  type MaterialState,
} from "@/app/[locale]/(site)/materiais/actions";
import { ConsentField, Field, fieldA11y, Honeypot, inputClass } from "@/components/ui/form-field";
import type { MaterialsUi } from "@/content/materials";
import type { Locale } from "@/i18n/routing";

type MaterialFormProps = {
  locale: Locale;
  material: string;
  copy: MaterialsUi["form"];
  messages: MaterialsUi["messages"];
  /** Exibido quando o envio pelo site ainda não está disponível (ex.: redes da Vispe). */
  fallback: ReactNode;
};

type SelectField = "segment" | "revenue" | "role" | "pain";

/** Formulário de captura dos materiais (mesmos campos das LPs atuais da Vispe). */
export function MaterialForm({ locale, material, copy, messages, fallback }: MaterialFormProps) {
  const [state, setState] = useState<MaterialState>({ status: "idle" });
  const [pending, startTransition] = useTransition();
  const { fields, placeholders } = copy;

  const errors: Partial<Record<MaterialField, string>> = state.status === "invalid" ? state.errors : {};
  const a11y = (field: MaterialField) => fieldA11y(`material-${field}`, errors[field]);
  const options: Record<SelectField, readonly string[]> = {
    segment: copy.segmentOptions,
    revenue: copy.revenueOptions,
    role: copy.roleOptions,
    pain: copy.painOptions,
  };

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await requestMaterial(state, formData);
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

  const select = (field: SelectField) => (
    <Field id={`material-${field}`} label={fields[field]} error={errors[field]}>
      <select
        id={`material-${field}`}
        name={field}
        required
        defaultValue=""
        className={inputClass}
        {...a11y(field)}
      >
        <option value="" disabled>
          {placeholders[field]}
        </option>
        {options[field].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="material" value={material} />
      <Honeypot />

      <div aria-live="polite">
        {state.status === "invalid" && (
          <p className="flex items-center gap-2 rounded-xl bg-accent-soft/40 px-4 py-3 text-sm font-medium text-fg">
            <CircleAlert className="h-4 w-4 shrink-0 text-brand-dark" aria-hidden />
            {errors.material ?? messages.invalid}
          </p>
        )}
        {state.status === "unavailable" && (
          <div className="rounded-xl bg-accent-soft/40 px-4 py-3 text-sm text-fg">
            <p>{messages.unavailable}</p>
            <div className="mt-3">{fallback}</div>
          </div>
        )}
      </div>

      <Field id="material-name" label={fields.name} error={errors.name}>
        <input id="material-name" name="name" type="text" autoComplete="name" required className={inputClass} {...a11y("name")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="material-phone" label={fields.phone} error={errors.phone}>
          <input
            id="material-phone"
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
        <Field id="material-email" label={fields.email} error={errors.email}>
          <input id="material-email" name="email" type="email" autoComplete="email" required className={inputClass} {...a11y("email")} />
        </Field>
      </div>
      <Field id="material-company" label={fields.company} error={errors.company}>
        <input id="material-company" name="company" type="text" autoComplete="organization" required className={inputClass} {...a11y("company")} />
      </Field>
      {/* Selects na largura toda: em duas colunas as opções longas ficavam cortadas. */}
      {select("segment")}
      {select("revenue")}
      {select("role")}
      {select("pain")}

      <label className="flex cursor-pointer items-start gap-3 text-sm text-fg-muted">
        <input type="checkbox" name="whatsapp" className="mt-0.5 h-4 w-4 shrink-0 accent-ink" />
        <span>{copy.whatsapp}</span>
      </label>
      <ConsentField id="material-consent" label={copy.consent} error={errors.consent} />

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-7 py-4 text-base font-semibold text-paper transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark disabled:opacity-60 md:text-sm"
      >
        {pending ? copy.sending : copy.submit}
        {!pending && <Download className="h-4 w-4" aria-hidden />}
      </button>
    </form>
  );
}
