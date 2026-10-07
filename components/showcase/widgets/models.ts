import type { FinWidget } from "@/content/fin-wall";

// Modelos de cálculo dos widgets vinculados nos cards de Soluções: mexer num
// widget "controle" recalcula os demais do mesmo card. Os valores iniciais
// reproduzem exatamente os números ilustrativos de content/*/fin-wall.ts, e
// as constantes abaixo são derivadas deles (ex.: clientes = receita / ticket).

export type ModelId = "controls" | "sales" | "runway" | "tax" | "deal" | "valuation";

/** Card de Soluções (slug do serviço) → modelo de cálculo. */
export const linkedModelBySlug: Partial<Record<string, ModelId>> = {
  "controladoria-financeira": "controls",
  "aceleracao-comercial": "sales",
  "captacao-de-recursos": "runway",
  ma: "deal",
  "planejamento-tributario": "tax",
  valuation: "valuation",
};

/** Arrastar na horizontal (ou setas do teclado) ajusta um número. */
export type ScrubControl = { kind: "scrub"; key: string; min: number; max: number; step: number };
/** Tocar alterna entre as opções do widget (ex.: regime tributário). */
export type CycleControl = { kind: "cycle"; key: string };
export type Control = ScrubControl | CycleControl;

export type Values = Record<string, number>;

/** Formata número no idioma da página (pt-BR: 186.200 / 4,2; en-US: 186,200 / 4.2). */
export type NumberFormat = (value: number, decimals?: number) => string;

type Model = {
  initial: Values;
  controls: Record<string, Control>;
  /**
   * Listas com checks ligadas ao cálculo: id do widget → chave em `values`,
   * onde cada item marcado é um bit (item i = 1 << i).
   */
  toggles?: Record<string, string>;
  /**
   * Animação de entrada: `values.intro` vai de 0 a 1 quando o card aparece na
   * tela (números sobem do zero). No servidor e com reduced motion, fica em 1.
   */
  intro?: boolean;
  derive: (widget: FinWidget, values: Values, format: NumberFormat) => FinWidget;
};

/** Quantos itens marcados numa máscara de bits. */
const countBits = (mask: number) => mask.toString(2).replaceAll("0", "").length;
const isSet = (mask: number, index: number) => (mask & (1 << index)) !== 0;

/** Troca o primeiro número do texto mantendo prefixo e sufixo ("R$ 186.200", "4,2 meses"). */
function replaceNumber(text: string, formatted: string) {
  return text.replace(/\d[\d.,]*/, formatted);
}

/** Variação em % com sinal, no lugar da do texto ("+12% vs agosto" → "−3% vs agosto"). */
function replaceDelta(text: string, ratio: number, format: NumberFormat, decimals = 0) {
  const percent = (ratio - 1) * 100;
  const sign = percent < 0 ? "−" : "+";
  return text.replace(/^[+−-]?\d[\d.,]*/, sign + format(Math.abs(percent), decimals));
}

const trend = (ratio: number): "up" | "down" => (ratio < 1 ? "down" : "up");

// — Controladoria Financeira: contas pagas e recebimentos sobem a conciliação
// (98% → 100%); o que entra dos clientes derruba a inadimplência, na proporção
// do valor recebido. Na entrada, DRE e indicadores sobem do zero.
const controls = {
  statement: [186, 121, 65], // DRE em R$ mil: receita, custos, lucro
  reconciliation: 98,
  defaultRate: 3,
  receivables: [12.4, 8.9, 5.1], // A receber em R$ mil, na ordem das linhas
  payables: 3,
};

// — Aceleração Comercial: receita = clientes × ticket médio.
const sales = {
  ticket: 2800,
  revenue: 186_200,
  goalPercent: 82,
  breakEvenPercent: 78,
  growth: 1.12, // "+12% vs agosto"
};
const salesClients = sales.revenue / sales.ticket;

// — Captação de Recursos: projeção = saldo / gasto mensal (saídas do dia × 8).
const runway = { inflow: 18_000, outflow: 9_400, balance: 312_480, dayGrowth: 1.024, daysPerMonth: 8, fullMonths: 6 };

// — Planejamento Tributário: imposto mensal por regime (na ordem de `options`
// do widget tax-regime). Economia no ano = diferença para o regime mais caro.
const taxTotals = [14_200 + 38_600 / 12, 14_200, 11_900]; // Simples = Presumido + economia de R$ 38.600/ano
const tax = { regime: 1, pisCofins: 6_800, iss: 3_700, taxesBar: 54, taxesBarAmount: 31_700 };

// — M&A: fluxo de caixa de 30 dias proporcional à margem bruta (a série
// "anterior" tracejada fica fixa, então a linha sobe ou desce em relação a ela).
const deal = { margin: 42, cashFlow: 48_320 };

// — Valuation: lucro e EBITDA proporcionais à margem líquida.
const valuation = { margin: 18, profit: 512_900, ebitda: 71, growth: 1.21 };

export const models: Record<ModelId, Model> = {
  controls: {
    initial: { intro: 1, paid: 0, received: 0 },
    controls: {},
    toggles: { payables: "paid", receivables: "received" },
    intro: true,
    derive(widget, { intro, paid, received }, format) {
      const receivedShare =
        controls.receivables.reduce((sum, amount, i) => (isSet(received, i) ? sum + amount : sum), 0) /
        controls.receivables.reduce((sum, amount) => sum + amount, 0);
      const done = countBits(paid) + countBits(received);
      const total = controls.payables + controls.receivables.length;
      switch (widget.id) {
        case "income-statement":
          if (widget.kind !== "list") return widget;
          return {
            ...widget,
            rows: widget.rows.map((row, i) =>
              row.value && controls.statement[i] !== undefined
                ? { ...row, value: replaceNumber(row.value, format(controls.statement[i] * intro)) }
                : row,
            ),
          };
        case "reconciliation": {
          if (widget.kind !== "badge") return widget;
          const percent = (controls.reconciliation + (100 - controls.reconciliation) * (done / total)) * intro;
          return { ...widget, label: `${format(percent, 1)}%` };
        }
        case "default-rate": {
          if (widget.kind !== "gauge") return widget;
          const rate = controls.defaultRate * (1 - receivedShare) * intro;
          return { ...widget, value: rate, display: `${format(rate, 1)}%` };
        }
        case "payables":
          if (widget.kind !== "list") return widget;
          return { ...widget, rows: widget.rows.map((row, i) => ({ ...row, marker: isSet(paid, i) ? "done" : "open" })) };
        case "receivables":
          if (widget.kind !== "list") return widget;
          return {
            ...widget,
            rows: widget.rows.map((row, i) => ({ ...row, marker: isSet(received, i) ? "done" : "open" })),
          };
        default:
          return widget;
      }
    },
  },

  sales: {
    initial: { ticket: sales.ticket },
    controls: { "avg-ticket": { kind: "scrub", key: "ticket", min: 1500, max: 4500, step: 100 } },
    derive(widget, { ticket }, format) {
      const revenue = ticket * salesClients;
      const ratio = revenue / sales.revenue;
      switch (widget.id) {
        case "avg-ticket":
          return widget.kind === "stat" ? { ...widget, value: replaceNumber(widget.value, format(ticket / 1000, 1)) } : widget;
        case "revenue":
          if (widget.kind !== "stat") return widget;
          return {
            ...widget,
            value: replaceNumber(widget.value, format(revenue)),
            delta: widget.delta && {
              text: replaceDelta(widget.delta.text, ratio * sales.growth, format),
              trend: trend(ratio * sales.growth),
            },
          };
        case "revenue-goal":
        case "break-even": {
          const base = widget.id === "revenue-goal" ? sales.goalPercent : sales.breakEvenPercent;
          const percent = base * ratio;
          if (widget.kind !== "gauge" && widget.kind !== "progress") return widget;
          return { ...widget, value: Math.min(percent, 100), display: `${format(percent)}%` };
        }
        default:
          return widget;
      }
    },
  },

  runway: {
    initial: { inflow: runway.inflow, outflow: runway.outflow },
    controls: {
      "in-today": { kind: "scrub", key: "inflow", min: 6000, max: 30_000, step: 200 },
      "out-today": { kind: "scrub", key: "outflow", min: 4000, max: 20_000, step: 200 },
    },
    derive(widget, { inflow, outflow }, format) {
      const monthly = runway.daysPerMonth;
      const balance = runway.balance + (inflow - runway.inflow) * monthly - (outflow - runway.outflow) * monthly;
      const months = balance / (outflow * monthly);
      switch (widget.id) {
        case "in-today":
        case "out-today": {
          const amount = widget.id === "in-today" ? inflow : outflow;
          return widget.kind === "stat" ? { ...widget, value: replaceNumber(widget.value, format(amount / 1000, 1)) } : widget;
        }
        case "balance": {
          if (widget.kind !== "stat") return widget;
          const ratio = (balance / runway.balance) * runway.dayGrowth;
          return {
            ...widget,
            value: replaceNumber(widget.value, format(balance)),
            delta: widget.delta && { text: replaceDelta(widget.delta.text, ratio, format, 1), trend: trend(ratio) },
          };
        }
        case "cash-runway":
          if (widget.kind !== "progress") return widget;
          return {
            ...widget,
            value: Math.min((months / runway.fullMonths) * 100, 100),
            display: replaceNumber(widget.display, format(months, 1)),
          };
        default:
          return widget;
      }
    },
  },

  tax: {
    initial: { regime: tax.regime },
    controls: { "tax-regime": { kind: "cycle", key: "regime" } },
    derive(widget, { regime }, format) {
      const total = taxTotals[regime] ?? taxTotals[tax.regime];
      const ratio = total / taxTotals[tax.regime];
      const thousands = (value: number) => format(value / 1000, 1);
      switch (widget.id) {
        case "tax-regime":
          return widget.kind === "badge" && widget.options
            ? { ...widget, label: widget.options[regime] ?? widget.label }
            : widget;
        case "taxes": {
          if (widget.kind !== "list") return widget;
          const amounts = [tax.pisCofins * ratio, tax.iss * ratio, total];
          return {
            ...widget,
            rows: widget.rows.map((row, i) =>
              row.value && amounts[i] !== undefined ? { ...row, value: replaceNumber(row.value, thousands(amounts[i])) } : row,
            ),
          };
        }
        case "tax-savings":
          return widget.kind === "stat"
            ? { ...widget, value: replaceNumber(widget.value, format((Math.max(...taxTotals) - total) * 12)) }
            : widget;
        case "expenses-by-category":
          if (widget.kind !== "bars") return widget;
          // A 2ª barra é a de impostos.
          return {
            ...widget,
            bars: widget.bars.map((bar, i) =>
              i === 1
                ? {
                    ...bar,
                    value: tax.taxesBar * ratio,
                    display: bar.display && replaceNumber(bar.display, thousands(tax.taxesBarAmount * ratio)),
                  }
                : bar,
            ),
          };
        default:
          return widget;
      }
    },
  },

  deal: {
    initial: { margin: deal.margin },
    controls: { "gross-margin": { kind: "scrub", key: "margin", min: 20, max: 65, step: 1 } },
    derive(widget, { margin }, format) {
      const ratio = margin / deal.margin;
      switch (widget.id) {
        case "gross-margin":
          return widget.kind === "gauge" ? { ...widget, value: margin, display: `${format(margin)}%` } : widget;
        case "cash-flow-30d":
          if (widget.kind !== "sparkline") return widget;
          return {
            ...widget,
            value: replaceNumber(widget.value, format(Math.round((deal.cashFlow * ratio) / 10) * 10)),
            points: widget.points.map((point) => point * ratio),
          };
        default:
          return widget;
      }
    },
  },

  valuation: {
    initial: { margin: valuation.margin },
    controls: { "net-margin": { kind: "scrub", key: "margin", min: 5, max: 35, step: 1 } },
    derive(widget, { margin }, format) {
      const ratio = margin / valuation.margin;
      switch (widget.id) {
        case "net-margin":
          return widget.kind === "gauge" ? { ...widget, value: margin, display: `${format(margin)}%` } : widget;
        case "ytd-profit":
          if (widget.kind !== "sparkline") return widget;
          return {
            ...widget,
            value: replaceNumber(widget.value, format(Math.round((valuation.profit * ratio) / 100) * 100)),
            delta: widget.delta && replaceDelta(widget.delta, ratio * valuation.growth, format),
          };
        case "ebitda":
          return widget.kind === "sparkline"
            ? { ...widget, value: replaceNumber(widget.value, format(valuation.ebitda * ratio)) }
            : widget;
        default:
          return widget;
      }
    },
  },
};
