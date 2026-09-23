"use client";

import { motion, useReducedMotion } from "motion/react";
import { TrendingUp, Wallet, PiggyBank } from "lucide-react";
import { spring } from "@/components/motion/presets";

const monthlyProfit = [42, 48, 45, 58, 63, 71];
const maxProfit = Math.max(...monthlyProfit);

export function FinancialDashboard() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full max-w-md rounded-3xl border border-border bg-glass p-6 shadow-[0_1px_2px_rgba(38,38,38,0.06),0_24px_48px_-16px_rgba(38,38,38,0.16)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-fg-muted">Saúde financeira</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-brand-dark">
          <TrendingUp className="h-3.5 w-3.5" aria-hidden />
          Em crescimento
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-surface p-4">
          <div className="flex items-center gap-2 text-fg-muted">
            <Wallet className="h-4 w-4" aria-hidden />
            <p className="text-xs font-medium">Caixa</p>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-fg">R$ 312 mil</p>
        </div>
        <div className="rounded-2xl bg-surface p-4">
          <div className="flex items-center gap-2 text-fg-muted">
            <PiggyBank className="h-4 w-4" aria-hidden />
            <p className="text-xs font-medium">Margem líquida</p>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-fg">18,4%</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-surface p-4">
        <p className="text-xs font-medium text-fg-muted">Lucro — últimos 6 meses</p>
        <div
          className="mt-3 flex h-20 items-end gap-2"
          role="img"
          aria-label="Gráfico de lucro crescente nos últimos 6 meses, ilustrativo"
        >
          {monthlyProfit.map((value, index) => (
            <motion.div
              key={index}
              initial={shouldReduceMotion ? { height: `${(value / maxProfit) * 100}%` } : { height: 0 }}
              animate={{ height: `${(value / maxProfit) * 100}%` }}
              transition={{ ...spring.smooth, delay: shouldReduceMotion ? 0 : index * 0.06 }}
              className="flex-1 rounded-t-md bg-brand"
            />
          ))}
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-fg-muted">
        Dados ilustrativos — representação do painel de acompanhamento financeiro Vispe.
      </p>
    </div>
  );
}
