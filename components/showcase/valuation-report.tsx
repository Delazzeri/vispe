const evolution = [2.1, 2.4, 2.3, 2.9, 3.4, 3.8, 4.2];
const max = Math.max(...evolution);
const min = Math.min(...evolution);

function sparklinePoints(values: number[], width: number, height: number) {
  const range = max - min || 1;
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

export function ValuationReport() {
  const points = sparklinePoints(evolution, 240, 56);

  return (
    <div className="w-full max-w-sm border border-border bg-paper font-sans shadow-[0_1px_1px_rgba(38,38,38,0.04),0_20px_40px_-24px_rgba(38,38,38,0.28)]">
      <div className="flex items-baseline justify-between border-b border-border px-7 pb-4 pt-6">
        <div>
          <p className="text-[13px] font-medium text-fg-muted">Laudo de Valuation</p>
          <p className="mt-0.5 text-sm font-semibold text-fg">Nortel Indústria Ltda.</p>
        </div>
        <p className="text-[11px] text-fg-muted">Set. 2026</p>
      </div>

      <div className="px-7 pt-6">
        <p className="text-[13px] text-fg-muted">Valor de mercado estimado</p>
        <p
          className="mt-1 text-[2.75rem] font-bold leading-none text-fg"
          style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}
        >
          R$ 4,2M
        </p>
        <p className="mt-2 text-[13px] text-brand-dark">
          <span aria-hidden>↑ </span>
          100% em 18 meses
        </p>
      </div>

      <div className="mt-5 px-7">
        <svg
          viewBox="0 0 240 56"
          className="w-full text-brand-dark"
          preserveAspectRatio="none"
          role="img"
          aria-label="Evolução do valuation nos últimos 18 meses, de R$ 2,1M a R$ 4,2M — ilustrativo"
        >
          <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="mt-6 grid grid-cols-3 border-t border-border text-[13px]">
        <div className="border-r border-border px-7 py-4">
          <p className="text-fg-muted">Múltiplo</p>
          <p className="mt-0.5 font-semibold text-fg">4,8x EBITDA</p>
        </div>
        <div className="border-r border-border px-7 py-4">
          <p className="text-fg-muted">Margem líquida</p>
          <p className="mt-0.5 font-semibold text-fg">18,4%</p>
        </div>
        <div className="px-7 py-4">
          <p className="text-fg-muted">Método</p>
          <p className="mt-0.5 font-semibold text-fg">Fluxo de caixa</p>
        </div>
      </div>

      <p className="border-t border-border px-7 py-3 text-[11px] leading-relaxed text-fg-muted">
        Dados ilustrativos — representação de um laudo de valuation elaborado pela Vispe Capital.
      </p>
    </div>
  );
}
