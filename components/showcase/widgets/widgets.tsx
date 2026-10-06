import type { ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  CircleCheck,
  FileText,
  Landmark,
  type LucideIcon,
  Percent,
  PiggyBank,
  Receipt,
  Search,
  ShieldCheck,
  Target,
  TrendingUp,
  TriangleAlert,
  Video,
  Wallet,
} from "lucide-react";
import type { FinWidget, WidgetIcon, WidgetSize, WidgetTone } from "@/content/fin-wall";
import { cn } from "@/lib/cn";
import { Bars, Checklist } from "./interactive";
import { LiveClock } from "./live-clock";

const icons: Record<WidgetIcon, LucideIcon> = {
  wallet: Wallet,
  bank: Landmark,
  in: ArrowUpRight,
  out: ArrowDownRight,
  receipt: Receipt,
  file: FileText,
  calendar: CalendarDays,
  bell: Bell,
  check: CircleCheck,
  alert: TriangleAlert,
  percent: Percent,
  target: Target,
  shield: ShieldCheck,
  piggy: PiggyBank,
  trend: TrendingUp,
  video: Video,
};

const toneText: Record<WidgetTone, string> = {
  default: "text-paper",
  brand: "text-brand",
  accent: "text-accent",
  muted: "text-paper/50",
};

const sizeWidth: Record<WidgetSize, string> = {
  s: "w-18",
  m: "w-58",
  l: "w-110",
};

function Shell({
  size,
  solid,
  className,
  children,
}: {
  size: WidgetSize;
  solid?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-18 max-w-full shrink-0 overflow-hidden rounded-2xl border border-paper/10 p-2.5 text-paper",
        // Vidro sobre a parede escura do Fin 24/7; preto sólido sobre fundos claros.
        solid ? "bg-ink" : "bg-paper/5",
        sizeWidth[size],
        className,
      )}
    >
      {children}
    </div>
  );
}

function IconTile({ icon, tone = "brand" }: { icon: WidgetIcon; tone?: WidgetTone }) {
  const Icon = icons[icon];
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper/10">
      <Icon className={cn("h-5 w-5", toneText[tone])} aria-hidden />
    </span>
  );
}

/** Converte uma série em path SVG num viewBox 100×32. */
function toPath(points: number[], min: number, max: number) {
  const range = max - min || 1;
  return points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 30 - ((p - min) / range) * 28;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function Sparkline({ points, compare }: { points: number[]; compare?: number[] }) {
  const all = [...points, ...(compare ?? [])];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const line = toPath(points, min, max);
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-full w-full overflow-visible">
      <path d={`${line} L100 32 L0 32 Z`} className="fill-brand/15" />
      {compare && (
        <path
          d={toPath(compare, min, max)}
          className="fill-none stroke-paper/30"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          vectorEffect="non-scaling-stroke"
        />
      )}
      <path
        d={line}
        className="fill-none stroke-brand"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function Ring({ value, tone }: { value: number; tone: WidgetTone }) {
  // r = 15.9155 → circunferência ≈ 100, então dasharray = porcentagem.
  return (
    <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90">
      <circle cx="18" cy="18" r="15.9155" className="fill-none stroke-paper/10" strokeWidth={3} />
      <circle
        cx="18"
        cy="18"
        r="15.9155"
        className={cn("fill-none", tone === "default" ? "stroke-paper" : tone === "accent" ? "stroke-accent" : "stroke-brand")}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={`${value} 100`}
      />
    </svg>
  );
}

function Marker({ marker, tone }: { marker: "open" | "done" | "dot"; tone: WidgetTone }) {
  if (marker === "done") {
    return (
      <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-brand">
        <Check className="h-2 w-2 text-brand-fg" strokeWidth={4} aria-hidden />
      </span>
    );
  }
  if (marker === "dot") return <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />;
  return (
    <span
      className={cn("h-3 w-3 shrink-0 rounded-full border-2", tone === "accent" ? "border-accent" : "border-brand")}
    />
  );
}

/** Widgets que têm versão interativa (ver `interactive.tsx`). */
export function hasInteractiveVersion(widget: FinWidget) {
  return (
    widget.kind === "bars" ||
    (widget.kind === "list" && widget.rows.some((row) => row.marker === "open" || row.marker === "done"))
  );
}

/**
 * `solid`: fundo preto sólido, para uso fora da parede escura (ex.: cards claros).
 * `interactive`: lista com checks e barras viram clicáveis (cards de Soluções).
 */
export function Widget({ widget, solid, interactive }: { widget: FinWidget; solid?: boolean; interactive?: boolean }) {
  const { size } = widget;

  if (interactive && hasInteractiveVersion(widget)) {
    if (widget.kind === "list") {
      return (
        <Shell size={size} solid={solid} className="flex-col justify-center">
          {widget.title && <p className="text-2xs font-semibold text-paper/60">{widget.title}</p>}
          <Checklist rows={widget.rows} />
        </Shell>
      );
    }
    if (widget.kind === "bars") {
      return (
        <Shell size={size} solid={solid} className="flex-col justify-center gap-0.5 py-2">
          <p className="text-2xs font-semibold text-paper/60">{widget.title}</p>
          <Bars bars={widget.bars} />
        </Shell>
      );
    }
  }

  switch (widget.kind) {
    case "stat": {
      if (size === "s") {
        const Icon = widget.icon ? icons[widget.icon] : null;
        return (
          <Shell size={size} solid={solid} className="flex-col justify-between">
            {Icon && <Icon className="h-4 w-4 text-brand" aria-hidden />}
            <div>
              <p className="text-sm font-bold leading-4 tabular-nums">{widget.value}</p>
              <p className="truncate text-2xs text-paper/50">{widget.label}</p>
            </div>
          </Shell>
        );
      }
      return (
        <Shell size={size} solid={solid} className="items-center gap-3">
          {widget.icon && <IconTile icon={widget.icon} />}
          <div className="min-w-0">
            <p className="truncate text-2xs text-paper/60">{widget.label}</p>
            <p className="text-lg font-bold leading-6 tracking-tight tabular-nums">{widget.value}</p>
            {widget.delta && (
              <p
                className={cn(
                  "flex items-center gap-0.5 text-2xs font-medium",
                  widget.delta.trend === "up" ? "text-brand" : "text-paper/50",
                )}
              >
                {widget.delta.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3" aria-hidden />
                ) : (
                  <ArrowDownRight className="h-3 w-3" aria-hidden />
                )}
                {widget.delta.text}
              </p>
            )}
          </div>
        </Shell>
      );
    }

    case "gauge":
      return (
        <Shell size={size} solid={solid} className="items-center justify-center p-2">
          <div className="relative flex h-full w-full items-center justify-center">
            <Ring value={widget.value} tone={widget.tone} />
            <span className="text-xs font-bold tabular-nums">{widget.display}</span>
          </div>
        </Shell>
      );

    case "sparkline":
      return (
        <Shell size={size} solid={solid} className={cn("gap-3", size === "l" ? "items-stretch" : "items-center")}>
          <div className="flex shrink-0 flex-col justify-center">
            <p className="text-2xs text-paper/60">{widget.label}</p>
            <p className="text-lg font-bold leading-6 tracking-tight tabular-nums">{widget.value}</p>
            {widget.delta && <p className="text-2xs font-medium text-brand">{widget.delta}</p>}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
            <div className="min-h-0 flex-1">
              <Sparkline points={widget.points} compare={widget.compare} />
            </div>
            {widget.axis && (
              <div className="mt-1 flex justify-between text-2xs text-paper/40">
                <span>{widget.axis[0]}</span>
                <span>{widget.axis[1]}</span>
              </div>
            )}
          </div>
        </Shell>
      );

    case "list":
      return (
        <Shell size={size} solid={solid} className="flex-col justify-center">
          {widget.title && <p className="text-2xs font-semibold text-paper/60">{widget.title}</p>}
          <ul className={cn("space-y-0.5", !widget.title && "space-y-1")}>
            {widget.rows.map((row) => (
              <li key={row.label} className="flex items-center gap-1.5 text-xs leading-4">
                {row.marker && <Marker marker={row.marker} tone={row.tone ?? "default"} />}
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate font-medium",
                    row.marker === "done" && "text-paper/50 line-through",
                  )}
                >
                  {row.label}
                </span>
                {row.value && (
                  <span className={cn("text-2xs font-semibold tabular-nums", toneText[row.tone ?? "muted"])}>
                    {row.value}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Shell>
      );

    case "bars":
      return (
        <Shell size={size} solid={solid} className="flex-col justify-center gap-0.5 py-2">
          <p className="text-2xs font-semibold text-paper/60">{widget.title}</p>
          {widget.bars.map((bar) => (
            <div key={bar.label} className="flex items-center gap-2">
              <span className="w-12 shrink-0 text-2xs text-paper/70">{bar.label}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper/10">
                <span className="block h-full rounded-full bg-brand" style={{ width: `${bar.value}%` }} />
              </span>
            </div>
          ))}
        </Shell>
      );

    case "calendar":
      return (
        <Shell size={size} solid={solid} className="flex-col justify-between">
          <p className="text-2xs font-semibold">{widget.month}</p>
          <div className="flex justify-between">
            {widget.days.map((d, i) => (
              <span
                key={d.day}
                className={cn(
                  "flex w-8 flex-col items-center rounded-lg py-0.5",
                  i === widget.active && "bg-brand text-brand-fg",
                )}
              >
                <span className={cn("text-2xs", i !== widget.active && "text-paper/50")}>{d.weekday}</span>
                <span className="text-sm font-bold leading-4 tabular-nums">{d.day}</span>
              </span>
            ))}
          </div>
        </Shell>
      );

    case "event":
      return (
        <Shell size={size} solid={solid} className="items-center gap-3">
          <div className="flex w-10 shrink-0 flex-col items-center">
            <span className="text-2xl font-bold leading-7 tabular-nums">{widget.day}</span>
            <span className="text-2xs text-paper/50">{widget.month}</span>
          </div>
          <div className="min-w-0 flex-1 border-l-2 border-brand pl-2">
            <p className="truncate text-xs font-semibold">{widget.title}</p>
            <p className="truncate text-2xs text-paper/50">{widget.detail}</p>
            {widget.value && <p className="text-2xs font-semibold text-brand tabular-nums">{widget.value}</p>}
          </div>
        </Shell>
      );

    case "notification":
      return (
        <Shell size={size} solid={solid} className="items-center gap-3">
          <IconTile icon={widget.icon} tone={widget.icon === "alert" ? "accent" : "brand"} />
          <div className="min-w-0">
            {widget.eyebrow && <p className="truncate text-2xs text-paper/50">{widget.eyebrow}</p>}
            <p className="truncate text-xs font-semibold">{widget.title}</p>
            <p className="truncate text-2xs text-paper/60">{widget.body}</p>
          </div>
        </Shell>
      );

    case "progress":
      return (
        <Shell size={size} solid={solid} className="flex-col justify-center gap-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-2xs text-paper/60">{widget.label}</p>
            <p className="text-sm font-bold tabular-nums">{widget.display}</p>
          </div>
          <span className="h-1.5 overflow-hidden rounded-full bg-paper/10">
            <span className="block h-full rounded-full bg-brand" style={{ width: `${widget.value}%` }} />
          </span>
          <p className="truncate text-2xs text-paper/40">{widget.caption}</p>
        </Shell>
      );

    case "badge": {
      const Icon = icons[widget.icon];
      return (
        <Shell size={size} solid={solid} className="flex-col items-center justify-center gap-1 p-1.5">
          <Icon className="h-5 w-5 text-brand" aria-hidden />
          <span className="max-w-full truncate text-2xs font-semibold">{widget.label}</span>
        </Shell>
      );
    }

    case "search":
      return (
        <Shell size={size} solid={solid} className="items-center gap-2 px-4">
          <Search className="h-4 w-4 shrink-0 text-paper/50" aria-hidden />
          <span className="flex-1 truncate text-sm text-paper/40">{widget.placeholder}</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-paper/10">
            <ArrowUpRight className="h-3.5 w-3.5 text-paper/70" aria-hidden />
          </span>
        </Shell>
      );

    case "clock":
      return (
        <Shell size={size} solid={solid} className="items-center justify-center p-1">
          <span className="text-base font-bold tracking-tight tabular-nums">
            <LiveClock />
          </span>
        </Shell>
      );
  }
}
