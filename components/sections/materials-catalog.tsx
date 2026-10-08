"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { CircleAlert, CircleCheck, Download, X } from "lucide-react";
import {
  requestMaterial,
  type MaterialField,
  type MaterialState,
} from "@/app/[locale]/(site)/materiais/actions";
import { ConsentField, ErrorText, Field, fieldA11y, Honeypot, inputClass } from "@/components/ui/form-field";
import type { Material, MaterialsContent } from "@/content/materials";
import type { Locale } from "@/i18n/routing";

type MaterialsCatalogProps = {
  locale: Locale;
  content: Pick<MaterialsContent, "items" | "categories" | "card" | "form" | "messages">;
};

/**
 * Cards dos materiais + cadastro em <dialog>: "Baixar grátis" abre o form;
 * depois do envio, o link de download aparece. Na mesma visita, os próximos
 * downloads pulam o cadastro.
 */
export function MaterialsCatalog({ locale, content }: MaterialsCatalogProps) {
  const { items, categories, card, form, messages } = content;
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Material>();
  const [state, setState] = useState<MaterialState>({ status: "idle" });
  const [unlocked, setUnlocked] = useState(false);
  const [pending, startTransition] = useTransition();

  const errors: Partial<Record<MaterialField, string>> = state.status === "invalid" ? state.errors : {};
  const a11y = (field: MaterialField) => fieldA11y(`material-${field}`, errors[field]);

  function open(material: Material) {
    setSelected(material);
    setState(unlocked && material.file ? { status: "success", file: material.file } : { status: "idle" });
    dialog.current?.showModal();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await requestMaterial(state, formData);
      setState(result);
      if (result.status === "success") setUnlocked(true);
    });
  }

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((material) => (
          <li key={material.slug} className="flex flex-col rounded-3xl border border-border bg-surface p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-md bg-ink px-2 py-1 text-paper">{material.type}</span>
              <span className="rounded-md bg-accent-soft/50 px-2 py-1 text-fg">
                {categories[material.category as keyof typeof categories] ?? material.category}
              </span>
            </div>
            <h2 className="mt-5 text-lg font-semibold text-fg">{material.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-fg-muted">{material.description}</p>
            {material.file ? (
              <button
                type="button"
                onClick={() => open(material)}
                className="mt-6 inline-flex items-center justify-center gap-2 self-start rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-paper transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
              >
                <Download className="h-4 w-4" aria-hidden />
                {card.download}
              </button>
            ) : (
              <span className="mt-6 inline-flex self-start rounded-xl border border-border px-5 py-3 text-sm font-semibold text-fg-muted">
                {card.soon}
              </span>
            )}
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-labelledby="material-dialog-title"
        onClose={() => setSelected(undefined)}
        className="m-auto w-[calc(100%-32px)] max-w-lg rounded-3xl bg-surface p-0 text-fg shadow-[0_24px_64px_-16px_rgba(38,38,38,0.35)] backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
      >
        <div className="relative p-6 md:p-8">
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label={form.close}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>

          <p className="pr-10 text-sm font-semibold text-brand-dark">{selected?.title}</p>
          <h2 id="material-dialog-title" className="mt-1 pr-10 text-2xl font-bold tracking-tight text-fg">
            {state.status === "success" ? messages.success : form.title}
          </h2>

          {state.status === "success" ? (
            <div role="status" className="mt-6">
              <a
                href={state.file}
                download
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-7 py-4 text-base font-semibold text-paper transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
              >
                <CircleCheck className="h-5 w-5" aria-hidden />
                {messages.downloadNow}
              </a>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="relative mt-2 space-y-4">
              <p className="text-sm text-fg-muted">{form.description}</p>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="material" value={selected?.slug ?? ""} />
              <Honeypot />

              <div aria-live="polite">
                {state.status === "invalid" && (
                  <p className="flex items-center gap-2 rounded-xl bg-accent-soft/40 px-4 py-3 text-sm font-medium text-fg">
                    <CircleAlert className="h-4 w-4 shrink-0 text-brand-dark" aria-hidden />
                    {messages.invalid}
                  </p>
                )}
                {errors.material && <ErrorText id="material-material-error">{errors.material}</ErrorText>}
              </div>

              <Field id="material-name" label={form.fields.name} error={errors.name}>
                <input id="material-name" name="name" type="text" autoComplete="name" required className={inputClass} {...a11y("name")} />
              </Field>
              <Field id="material-email" label={form.fields.email} error={errors.email}>
                <input id="material-email" name="email" type="email" autoComplete="email" required className={inputClass} {...a11y("email")} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="material-phone" label={form.fields.phone} error={errors.phone}>
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
                <Field id="material-company" label={form.fields.company} error={errors.company}>
                  <input id="material-company" name="company" type="text" autoComplete="organization" required className={inputClass} {...a11y("company")} />
                </Field>
              </div>

              <ConsentField id="material-consent" label={form.consent} error={errors.consent} />

              <button
                type="submit"
                disabled={pending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-7 py-4 text-base font-semibold text-paper transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark disabled:opacity-60"
              >
                {pending ? form.sending : form.submit}
                {!pending && <Download className="h-4 w-4" aria-hidden />}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
