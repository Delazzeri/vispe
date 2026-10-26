"use client";

import { useState, useTransition, type FormEvent } from "react";
import { ArrowRight, CircleAlert, CircleCheck } from "lucide-react";
import { ConsentField, Field, fieldA11y, Honeypot, inputClass } from "@/components/ui/form-field";
import type { LpUi } from "@/content/lp-ui";
import { format } from "@/content/types";
import { localizePath } from "@/i18n/href";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { fieldOptions, submitLandingForm, type LandingFormState } from "@/lib/forms/landing";
import { lpFormAnchor, type LpForm as LpFormData, type LpFormField } from "@/lib/lp/types";
import { isWhatsappGroupLink } from "@/lib/lp/whatsapp";

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

/** Destino da página de obrigado: link completo ou endereço de outra LP no idioma atual. */
function redirectTarget(value: string, locale: Locale): string | undefined {
  const target = value.trim();
  if (!target) return undefined;
  if (/^https?:\/\//i.test(target)) return target;
  const slug = target.replace(/^\/?(lp\/)?/, "").replace(/\/$/, "");
  return slug ? localizePath(`/lp/${slug}`, locale) : undefined;
}

/**
 * Cartão do formulário da LP (âncora #formulario), usado no topo (hero com
 * formulário) ou na faixa do formulário. Grava na aba "LP's" da planilha, com o
 * nome da LP e as colunas em português (`columns`); depois do envio mostra a
 * mensagem, vai para a página de obrigado ou para o grupo do WhatsApp.
 */
export function LpFormCard({
  data,
  page,
  columns,
  locale,
  ui,
  headingId,
  preview = false,
}: {
  data: LpFormData;
  page: { slug: string; name: string; template: string };
  columns: [string, string][];
  locale: Locale;
  ui: LpUi;
  /** Título que nomeia o formulário (aria-labelledby). */
  headingId?: string;
  /** Pré-visualização do admin: mostra o resultado sem enviar nada. */
  preview?: boolean;
}) {
  const [state, setState] = useState<LandingFormState>({ status: "idle" });
  const [pending, startTransition] = useTransition();
  const errors = state.status === "invalid" ? state.errors : {};
  const target =
    data.afterSubmit === "redirect"
      ? redirectTarget(data.redirectTo, locale)
      : data.afterSubmit === "whatsapp" && isWhatsappGroupLink(data.whatsappGroup)
        ? data.whatsappGroup.trim()
        : undefined;
  const [redirecting, setRedirecting] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (preview) return setState({ status: "success" });
    const form = event.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await submitLandingForm(formData, { ...page, locale, fields: data.fields, columns });
      if (result.status === "success" && target) {
        setRedirecting(true);
        window.location.assign(target);
        return;
      }
      setState(result);
      if (result.status === "success") form.reset();
    });
  }

  return (
    <div id={lpFormAnchor} className="scroll-mt-6 rounded-3xl bg-surface p-6 text-fg shadow-[0_24px_64px_-24px_rgba(0,0,0,0.45)] md:p-8">
      {state.status === "success" || redirecting ? (
        <div role="status" className="flex items-start gap-3 rounded-2xl bg-accent-soft/40 p-6">
          <CircleCheck className="mt-0.5 h-6 w-6 shrink-0 text-brand-dark" aria-hidden />
          <p className="text-base text-fg">
            {redirecting
              ? data.afterSubmit === "whatsapp"
                ? ui.form.redirectingWhatsapp
                : ui.form.redirecting
              : preview && target
                ? format(ui.form.previewRedirect, { target })
                : data.successMessage || ui.form.success}
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate aria-labelledby={headingId} className="space-y-5">
          <Honeypot />
          <div aria-live="polite">
            {state.status === "invalid" && (
              <p className="flex items-center gap-2 rounded-xl bg-accent-soft/40 px-4 py-3 text-sm font-medium text-fg">
                <CircleAlert className="h-4 w-4 shrink-0 text-brand-dark" aria-hidden />
                {ui.form.invalid}
              </p>
            )}
            {state.status === "unavailable" && <p className="rounded-xl bg-accent-soft/40 px-4 py-3 text-sm text-fg">{ui.form.unavailable}</p>}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {data.fields.map((field) => (
              <Field
                key={field.id}
                id={`lp-${field.id}`}
                label={field.label}
                error={errors[field.id]}
                className={["message", "text", "select", "name"].includes(field.kind) || data.fields.length < 3 ? "sm:col-span-2" : undefined}
              >
                <Control field={field} error={errors[field.id]} locale={locale} ui={ui} />
              </Field>
            ))}
          </div>

          <ConsentField id={`${lpFormAnchor}-consent`} label={data.consent || ui.form.consent} error={errors.consent} />

          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-7 py-4 text-base font-semibold text-brand-fg transition-colors hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {pending ? ui.form.sending : data.submitLabel}
            {!pending && <ArrowRight className="h-4 w-4" aria-hidden />}
          </button>
        </form>
      )}
    </div>
  );
}
