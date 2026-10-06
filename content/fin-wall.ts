import { useLocale } from "next-intl";
import { resolveLocale, type Locale } from "@/i18n/routing";
import { finWall as enUS } from "./en-US/fin-wall";
import { finWall as ptBR } from "./pt-BR/fin-wall";

// Tipos e acesso por idioma da parede de widgets do Fin 24/7.

export type WidgetSize = "s" | "m" | "l";
export type WidgetTone = "default" | "brand" | "accent" | "muted";
export type WidgetIcon =
  | "wallet"
  | "bank"
  | "in"
  | "out"
  | "receipt"
  | "file"
  | "calendar"
  | "bell"
  | "check"
  | "alert"
  | "percent"
  | "target"
  | "shield"
  | "piggy"
  | "trend"
  | "video";

type Base = { id: string; size: WidgetSize; hideOnMobile?: boolean };

export type FinWidget = Base &
  (
    | {
        kind: "stat";
        label: string;
        value: string;
        icon?: WidgetIcon;
        delta?: { text: string; trend: "up" | "down" };
      }
    | { kind: "gauge"; label: string; value: number; display: string; tone: WidgetTone }
    | {
        kind: "sparkline";
        label: string;
        value: string;
        points: number[];
        compare?: number[];
        delta?: string;
        axis?: [string, string];
      }
    | {
        kind: "list";
        title?: string;
        rows: { label: string; value?: string; tone?: WidgetTone; marker?: "open" | "done" | "dot" }[];
      }
    | { kind: "bars"; title: string; bars: { label: string; value: number; display?: string }[] }
    | { kind: "calendar"; month: string; days: { weekday: string; day: string }[]; active: number }
    | { kind: "event"; day: string; month: string; title: string; detail: string; value?: string }
    | { kind: "notification"; icon: WidgetIcon; eyebrow?: string; title: string; body: string }
    | { kind: "progress"; label: string; display: string; value: number; caption: string }
    | { kind: "badge"; icon: WidgetIcon; label: string }
    | { kind: "search"; placeholder: string }
    | { kind: "clock" }
  );

const walls: Record<Locale, readonly FinWidget[]> = { "pt-BR": ptBR, "en-US": enUS };

export function useFinWall(): readonly FinWidget[] {
  return walls[resolveLocale(useLocale())];
}
