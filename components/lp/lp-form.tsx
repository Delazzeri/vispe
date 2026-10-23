"use client";

import { useState, useTransition, type FormEvent } from "react";
import { ArrowRight, CircleAlert, CircleCheck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ConsentField, Field, fieldA11y, Honeypot, inputClass } from "@/components/ui/form-field";
import type { LpUi } from "@/content/lp-ui";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { fieldOptions, submitLandingForm, type LandingFormState } from "@/lib/forms/landing";
import { lpFormAnchor, type LpForm as LpFormData, type LpFormField } from "@/lib/lp/types";
import { lpCardClass } from "./parts";

const autoComplete: Partial<Record<LpFormField["kind"], string>> = {
  name: "name",
  email: "email",
  phone: "tel",
  company: "organization",
  role: "organization-title",
};

function Control({ field, error, locale, ui }: { field: LpFormField; error?: string; locale: Locale; ui: LpUi }) {
  const id = `lp-${field.id}`;
  const common = { id, name: field.id, required: field.required, ...fieldA11y(id, error) };
  const options = fieldOptions(field, locale);

  if (options.length) {
    return (
      <select {...common} defaultValue="" className={inputClass}>
        <option value="" disabled>
          {ui.form.selectPlaceholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }
  if (field.kind === "message") {
    return <textarea {...common} rows={4} maxLength={2000} className={cn(inputClass, "resize-y")} />;
  }
  return (
    <input
      {...common}
      type={field.kind === "email" ? "email" : field.kind === "phone" ? "tel" : "text"}
      inputMode={field.kind === "phone" ? "tel" : undefined}
      autoComplete={autoComplete[field.kind]}
      placeholder={field.kind === "phone" ? "(00) 00000-0000" : undefined}
      className={inputClass}
    />
  );
}

/**
 * Formulário da LP (âncora #formulario): campos escolhidos no admin. Grava na
 * aba "lp-<slug>" da planilha, com as colunas em português (`columns`).
 */
export function LpFormSection({
  id,
  data,
  page,
  columns,
  locale,
  ui,
  preview = false,
}: {
  id: string;
  data: LpFormData;
  page: { slug: string; name: string };
  columns: [string, string][];
  locale: Locale;
  ui: LpUi;
  /** Pré-visualização do admin: mostra o sucesso sem enviar nada. */
  preview?: boolean;
}) {
  const [state, setState] = useState<LandingFormState>({ status: "idle" });
  const [pending, startTransition] = useTransition();
  const errors = state.status === "invalid" ? state.errors : {};

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (preview) return setState({ status: "success" });
    const form = event.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await submitLandingForm(formData, { ...page, locale, fields: data.fields, columns });
      setState(result);
      if (result.status === "success") form.reset();
    });
  }

  return (
    <section id={lpFormAnchor} aria-labelledby={`${id}-heading`} className="scroll-mt-6 bg-bg py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-12 md:gap-12">
        <Reveal className="md:sticky md:top-10 md:col-span-5 md:self-start">
          <h2
            id={`${id}-heading`}
            className="text-balance text-3xl font-bold tracking-tight text-ink md:text-[48px] md:leading-[48px]"
            style={{ letterSpacing: "-0.05em" }}
          >
            {data.title}
          </h2>
          {data.subtitle && <p className="mt-5 text-lg leading-relaxed text-fg-muted">{data.subtitle}</p>}
        </Reveal>

        <div className={cn(lpCardClass, "relative p-6 md:col-span-7 md:p-8")}>
          {state.status === "success" ? (
            <div role="status" className="flex items-start gap-3 rounded-2xl bg-accent-soft/40 p-6">
              <CircleCheck className="mt-0.5 h-6 w-6 shrink-0 text-brand-dark" aria-hidden />
              <p className="text-base text-fg">{data.successMessage || ui.form.success}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <Honeypot />
              <div aria-live="polite">
                {state.status === "invalid" && (
                  <p className="flex items-center gap-2 rounded-xl bg-accent-soft/40 px-4 py-3 text-sm font-medium text-fg">
                    <CircleAlert className="h-4 w-4 shrink-0 text-brand-dark" aria-hidden />
                    {ui.form.invalid}
                  </p>
                )}
                {state.status === "unavailable" && (
                  <p className="rounded-xl bg-accent-soft/40 px-4 py-3 text-sm text-fg">{ui.form.unavailable}</p>
                )}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {data.fields.map((field) => (
                  <Field
                    key={field.id}
                    id={`lp-${field.id}`}
                    label={field.label}
                    error={errors[field.id]}
                    className={field.kind === "message" || field.kind === "text" || field.kind === "select" || field.kind === "name" ? "md:col-span-2" : undefined}
                  >
                    <Control field={field} error={errors[field.id]} locale={locale} ui={ui} />
                  </Field>
                ))}
              </div>

              <ConsentField id={`${id}-consent`} label={data.consent || ui.form.consent} error={errors.consent} />

              <button
                type="submit"
                disabled={pending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-7 py-4 text-base font-semibold text-paper transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark disabled:opacity-60 md:w-auto md:text-sm"
              >
                {pending ? ui.form.sending : data.submitLabel}
                {!pending && <ArrowRight className="h-4 w-4" aria-hidden />}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
