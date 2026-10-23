import type { LpUi } from "@/content/lp-ui";
import type { LpComparison as LpComparisonData } from "@/lib/lp/types";
import { LpSectionShell } from "./parts";

/** Comparação em tabela: a coluna do upgrade em destaque (cabeçalho preto, fundo dourado claro). */
export function LpComparison({ id, data, ui }: { id: string; data: LpComparisonData; ui: LpUi }) {
  if (data.rows.length === 0) return null;
  return (
    <LpSectionShell id={id} title={data.title} subtitle={data.subtitle} cta={data.cta} layout="stacked">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left text-base">
          <caption className="sr-only">{data.title}</caption>
          <thead>
            <tr>
              <th scope="col" className="w-2/5 py-4 pr-4 text-sm font-semibold text-fg-muted">
                {ui.comparison.feature}
              </th>
              <th scope="col" className="px-5 py-4 text-sm font-semibold text-fg">
                {data.currentLabel}
              </th>
              <th scope="col" className="rounded-t-2xl bg-ink px-5 py-4 text-sm font-semibold text-paper">
                {data.upgradeLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, index) => (
              <tr key={`${row.feature}-${index}`} className="border-t border-border">
                <th scope="row" className="py-4 pr-4 font-medium text-ink">
                  {row.feature}
                </th>
                <td className="px-5 py-4 text-fg-muted">{row.current}</td>
                <td className={`bg-accent-soft/40 px-5 py-4 font-semibold text-ink ${index === data.rows.length - 1 ? "rounded-b-2xl" : ""}`}>
                  {row.upgrade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LpSectionShell>
  );
}
