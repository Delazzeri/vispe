"use client";

import { useRef, useState, useTransition, type DragEvent, type FormEvent, type ReactNode } from "react";
import { Check, CircleAlert, CircleCheck, FileText, Mail, Upload } from "lucide-react";
import {
  submitApplication,
  type ApplicationField,
  type ApplicationState,
} from "@/app/[locale]/(site)/trabalhe-conosco/actions";
import type { CareersContent } from "@/content/careers";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

type CareersFormProps = {
  locale: Locale;
  copy: CareersContent["form"];
  messages: CareersContent["messages"];
  hrEmail: string;
  maxBytes: number;
};

const inputClass =
  "mt-2 block w-full rounded-xl border border-border bg-bg/60 px-4 py-3 text-base text-fg placeholder:text-fg-muted transition-colors focus:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark aria-invalid:border-brand-dark";

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-brand-dark">
      <CircleAlert className="h-4 w-4 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

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
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}

/** Etapa numerada do formulário (fieldset + legend). */
function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-border pt-8">
      <legend className="flex items-center gap-3 text-base font-semibold text-fg">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-bold text-paper tabular-nums">
          {n}
        </span>
        {title}
      </legend>
      <div className="mt-6">{children}</div>
    </fieldset>
  );
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function CareersForm({ locale, copy, messages, hrEmail, maxBytes }: CareersFormProps) {
  const [state, setState] = useState<ApplicationState>({ status: "idle" });
  const [file, setFile] = useState<File>();
  const [fileError, setFileError] = useState<string>();
  const [dragging, setDragging] = useState(false);
  const [area, setArea] = useState<string>();
  const [pending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);
  const { fields, steps } = copy;
  const selectedArea = copy.areas.find((a) => a.name === area);

  const errors: Partial<Record<ApplicationField, string>> =
    state.status === "invalid" ? state.errors : {};
  const resumeError = fileError ?? errors.resume;

  const a11y = (field: ApplicationField, describedBy?: string) => {
    const error = field === "resume" ? resumeError : errors[field];
    return {
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${field}-error` : describedBy,
    };
  };

  function pickFile(next: File | undefined) {
    setFile(next);
    if (!next) return setFileError(undefined);
    if (next.type !== "application/pdf" && !next.name.toLowerCase().endsWith(".pdf")) {
      return setFileError(messages.errors.resumeType);
    }
    if (next.size > maxBytes) return setFileError(messages.errors.resumeSize);
    setFileError(undefined);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    const dropped = event.dataTransfer.files;
    if (!dropped.length || !fileInput.current) return;
    // Mantém o input como fonte da verdade: o FormData lê o arquivo dele.
    fileInput.current.files = dropped;
    pickFile(dropped[0]);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    // Sem reset automático do form: em caso de erro, o que foi digitado fica.
    event.preventDefault();
    if (fileError) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await submitApplication(state, formData);
      setState(result);
      if (result.status === "success") {
        form.reset();
        setFile(undefined);
        setArea(undefined);
      }
    });
  }

  if (state.status === "success") {
    return (
      <div role="status" className="mt-10 flex items-start gap-3 rounded-2xl bg-accent-soft/40 p-6">
        <CircleCheck className="mt-0.5 h-6 w-6 shrink-0 text-brand-dark" aria-hidden />
        <p className="text-base text-fg">{messages.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative mt-10 space-y-10">
      <input type="hidden" name="locale" value={locale} />
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
            <a
              href={`mailto:${hrEmail}`}
              className="mt-2 inline-flex items-center gap-2 rounded-sm font-semibold text-brand-dark underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {hrEmail}
            </a>
          </div>
        )}
      </div>

      <Step n={1} title={steps.about}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="name" label={fields.name} error={errors.name} className="md:col-span-2">
            <input id="name" name="name" type="text" autoComplete="name" required className={inputClass} {...a11y("name")} />
          </Field>
          <Field id="email" label={fields.email} error={errors.email}>
            <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} {...a11y("email")} />
          </Field>
          <Field id="phone" label={fields.phone} error={errors.phone}>
            <input id="phone" name="phone" type="tel" autoComplete="tel" required className={inputClass} {...a11y("phone")} />
          </Field>
          <Field id="city" label={fields.city} error={errors.city}>
            <input id="city" name="city" type="text" autoComplete="address-level2" required className={inputClass} {...a11y("city")} />
          </Field>
          <Field id="linkedin" label={fields.linkedin} error={errors.linkedin}>
            <input
              id="linkedin"
              name="linkedin"
              type="url"
              inputMode="url"
              placeholder="https://linkedin.com/in/…"
              className={inputClass}
              {...a11y("linkedin")}
            />
          </Field>
        </div>
      </Step>

      <Step n={2} title={steps.area}>
        <p id="area-label" className="text-sm font-medium text-fg">
          {fields.area}
        </p>
        <div
          role="radiogroup"
          aria-labelledby="area-label"
          {...a11y("area")}
          className="mt-3 flex flex-wrap gap-2"
        >
          {copy.areas.map(({ name }) => (
            <label key={name} className="cursor-pointer">
              <input
                type="radio"
                name="area"
                value={name}
                required
                checked={area === name}
                onChange={() => setArea(name)}
                className="peer sr-only"
              />
              <span className="inline-flex rounded-full border border-border bg-bg/60 px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-fg/30 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:ring-2 peer-focus-visible:ring-brand-dark peer-focus-visible:ring-offset-2">
                {name}
              </span>
            </label>
          ))}
        </div>
        {errors.area && <ErrorText id="area-error">{errors.area}</ErrorText>}

        {/* Cargos da área escolhida — key reinicia a seleção ao trocar de área. */}
        {selectedArea && (
          <div key={selectedArea.name} className="mt-6 rounded-2xl border border-border bg-bg/60 p-5">
            {selectedArea.roles.length > 0 ? (
              <>
                <p id="roles-label" className="text-sm font-medium text-fg">
                  {fields.roles} <span className="font-normal text-fg-muted">· {fields.rolesHint}</span>
                </p>
                <div
                  role="group"
                  aria-labelledby="roles-label"
                  {...a11y("roles")}
                  className="mt-3 flex flex-wrap gap-2"
                >
                  {[...selectedArea.roles, copy.internship].map((role) => (
                    <label
                      key={role}
                      className="group inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-medium text-fg transition-colors hover:border-fg/30 has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:ring-2 has-focus-visible:ring-brand-dark has-focus-visible:ring-offset-2"
                    >
                      <input type="checkbox" name="roles" value={role} className="sr-only" />
                      <span
                        aria-hidden
                        className="flex h-4 w-4 items-center justify-center rounded border border-fg/30 group-has-checked:border-brand group-has-checked:bg-brand"
                      >
                        <Check className="hidden h-3 w-3 text-brand-fg group-has-checked:block" strokeWidth={3} />
                      </span>
                      {role}
                    </label>
                  ))}
                </div>
              </>
            ) : (
              <Field id="roleOther" label={fields.roleOther}>
                <input id="roleOther" name="roleOther" type="text" required className={cn(inputClass, "bg-surface")} {...a11y("roles")} />
              </Field>
            )}
            {errors.roles && <ErrorText id="roles-error">{errors.roles}</ErrorText>}
          </div>
        )}

        <Field id="message" label={fields.message} className="mt-6">
          <textarea id="message" name="message" rows={4} className={cn(inputClass, "resize-y")} />
        </Field>
      </Step>

      <Step n={3} title={steps.resume}>
        <label
          htmlFor="resume"
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors focus-within:ring-2 focus-within:ring-brand-dark",
            dragging ? "border-brand bg-accent-soft/30" : "border-border bg-bg/60 hover:border-fg/30",
            resumeError && "border-brand-dark",
          )}
        >
          <span className="sr-only">{fields.resume}</span>
          {file && !fileError ? (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink">
                <FileText className="h-6 w-6 text-brand" aria-hidden />
              </span>
              <span className="text-sm font-semibold text-fg">{file.name}</span>
              <span className="text-xs text-fg-muted">
                {formatSize(file.size)} · <span className="underline underline-offset-2">{fields.resumeReplace}</span>
              </span>
            </>
          ) : (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface shadow-sm">
                <Upload className="h-5 w-5 text-brand-dark" aria-hidden />
              </span>
              <span className="text-sm font-semibold text-fg">{fields.resumeDrop}</span>
              <span id="resume-hint" className="max-w-sm text-xs text-fg-muted">
                {fields.resumeHint}
              </span>
            </>
          )}
          <input
            ref={fileInput}
            id="resume"
            name="resume"
            type="file"
            accept="application/pdf,.pdf"
            required
            onChange={(e) => pickFile(e.currentTarget.files?.[0])}
            className="sr-only"
            {...a11y("resume", file ? undefined : "resume-hint")}
          />
        </label>
        {resumeError && <ErrorText id="resume-error">{resumeError}</ErrorText>}
      </Step>

      {/* Honeypot: fora da tela e fora da ordem de tabulação. */}
      <div aria-hidden className="absolute -left-full h-0 w-0 overflow-hidden">
        <label htmlFor="company">{fields.honeypot}</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="border-t border-border pt-8">
        <div className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
            {...a11y("consent")}
          />
          <label htmlFor="consent" className="text-sm leading-5 text-fg-muted">
            {copy.consent}
          </label>
        </div>
        {errors.consent && <ErrorText id="consent-error">{errors.consent}</ErrorText>}

        <button
          type="submit"
          disabled={pending}
          className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-ink px-7 py-4 text-sm font-semibold text-paper transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {pending ? copy.submitting : copy.submit}
        </button>
      </div>
    </form>
  );
}
