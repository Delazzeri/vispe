export type CountTile = { label: string; count: number };

const number = new Intl.NumberFormat("pt-BR");

/** Totais no topo das listas do admin (por formato, modelo ou assunto). */
export function CountTiles({ label, total, tiles }: { label: string; total: CountTile; tiles: CountTile[] }) {
  return (
    <ul aria-label={label} className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {[total, ...tiles].map((tile, index) => (
        <li key={tile.label} className={`rounded-2xl border border-border px-4 py-3 ${index === 0 ? "bg-ink text-paper" : "bg-surface"}`}>
          <span className={`block text-2xl font-bold tabular-nums ${index === 0 ? "text-paper" : "text-ink"}`}>{number.format(tile.count)}</span>
          <span className={`mt-0.5 block text-xs font-medium ${index === 0 ? "text-paper/80" : "text-fg-muted"}`}>{tile.label}</span>
        </li>
      ))}
    </ul>
  );
}
