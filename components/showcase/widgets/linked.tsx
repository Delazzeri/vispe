"use client";

import { useLocale } from "next-intl";
import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import type { FinWidget } from "@/content/fin-wall";
import { cn } from "@/lib/cn";
import { models, type CycleControl, type ModelId, type NumberFormat, type ScrubControl, type Values } from "./models";
import { hasInteractiveVersion, Widget } from "./widgets";

/** Distância de arraste (px) que percorre a faixa inteira do controle. */
const dragRange = 240;

type LinkedLabels = { adjust: string; cycle: string };

/** Ponto dourado pulsando no canto: indica que o widget mexe nos outros, até o 1º uso. */
function Hint({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <span aria-hidden className="pointer-events-none absolute -top-1 -right-1 z-10 flex h-3 w-3">
      <span className="absolute inline-flex h-full w-full rounded-full bg-brand opacity-75 motion-safe:animate-ping" />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-brand" />
    </span>
  );
}

const controlClass =
  "relative rounded-2xl outline-none ring-brand/0 transition-shadow hover:ring-2 hover:ring-brand/60 focus-visible:ring-2 focus-visible:ring-brand";

/** Slider acessível sobre o widget: arrastar na horizontal ou setas/Home/End. */
function Scrubber({
  control,
  value,
  label,
  valueText,
  hint,
  onChange,
  className,
  children,
}: {
  control: ScrubControl;
  value: number;
  label: string;
  valueText: string;
  hint: string;
  onChange: (value: number) => void;
  className?: string;
  children: ReactNode;
}) {
  const drag = useRef<{ x: number; start: number } | null>(null);
  const { min, max, step } = control;

  const set = (next: number) => onChange(Math.min(max, Math.max(min, Math.round(next / step) * step)));

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, start: value };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    set(drag.current.start + ((event.clientX - drag.current.x) / dragRange) * (max - min));
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, number> = {
      ArrowRight: value + step,
      ArrowUp: value + step,
      ArrowLeft: value - step,
      ArrowDown: value - step,
      Home: min,
      End: max,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    set(keys[event.key]);
  }

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={valueText}
      title={hint}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
      onKeyDown={onKeyDown}
      // pan-y: no celular a rolagem vertical continua; o arraste horizontal ajusta.
      className={cn(controlClass, "cursor-ew-resize touch-pan-y select-none", className)}
    >
      {children}
    </div>
  );
}

/** Botão sobre o widget que alterna entre as opções (ex.: regime tributário). */
function Cycler({
  label,
  hint,
  onCycle,
  className,
  children,
}: {
  label: string;
  hint: string;
  onCycle: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onCycle}
      aria-label={`${label}. ${hint}`}
      title={hint}
      className={cn(controlClass, "block cursor-pointer text-left", className)}
    >
      {children}
    </button>
  );
}

/** Texto do widget para leitores de tela (valor atual do controle). */
function widgetText(widget: FinWidget) {
  switch (widget.kind) {
    case "stat":
      return `${widget.label}: ${widget.value}`;
    case "gauge":
      return `${widget.label}: ${widget.display}`;
    case "badge":
      return widget.label;
    default:
      return "";
  }
}

/**
 * Widgets de um card ligados por um modelo de cálculo (ver models.ts): os
 * controles (arrastar/tocar) mudam os valores e o card inteiro é recalculado.
 */
export function LinkedWidgets({
  modelId,
  widgets,
  hiddenOnMobile,
  labels,
}: {
  modelId: ModelId;
  widgets: readonly FinWidget[];
  hiddenOnMobile: readonly string[];
  labels: LinkedLabels;
}) {
  const model = models[modelId];
  const locale = useLocale();
  const [values, setValues] = useState<Values>(model.initial);
  const [touched, setTouched] = useState(false);

  const format = useMemo<NumberFormat>(() => {
    // Até 0 ou 1 casa decimal: "18k" e "9,4k" no mesmo formato.
    const formatters = [0, 1].map((digits) => new Intl.NumberFormat(locale, { maximumFractionDigits: digits }));
    return (value, decimals = 0) => formatters[Math.min(decimals, 1)].format(value);
  }, [locale]);

  const update = (key: string, value: number) => {
    setTouched(true);
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return widgets.map((source) => {
    const widget = model.derive(source, values, format);
    const control = model.controls[widget.id];
    const hidden = hiddenOnMobile.includes(widget.id) && "max-md:hidden";

    if (control?.kind === "scrub") {
      return (
        <Scrubber
          key={widget.id}
          control={control}
          value={values[control.key]}
          label={widget.kind === "stat" || widget.kind === "gauge" ? widget.label : widget.id}
          valueText={widgetText(widget)}
          hint={labels.adjust}
          onChange={(value) => update(control.key, value)}
          className={cn(hidden)}
        >
          <Hint visible={!touched} />
          <Widget widget={widget} solid />
        </Scrubber>
      );
    }

    if (control?.kind === "cycle" && widget.kind === "badge" && widget.options) {
      const options = widget.options;
      const { key } = control satisfies CycleControl;
      return (
        <Cycler
          key={widget.id}
          label={widgetText(widget)}
          hint={labels.cycle}
          onCycle={() => update(key, (values[key] + 1) % options.length)}
          className={cn(hidden)}
        >
          <Hint visible={!touched} />
          <Widget widget={widget} solid />
        </Cycler>
      );
    }

    const interactive = hasInteractiveVersion(widget);
    return (
      <div key={widget.id} aria-hidden={!interactive || undefined} className={cn("contents", hidden)}>
        <Widget widget={widget} solid interactive={interactive} />
      </div>
    );
  });
}
