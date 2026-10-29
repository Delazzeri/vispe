export type CountTile = { label: string; count: number };

const number = new Intl.NumberFormat("pt-BR");

/** Totais no topo das listas do admin (por formato, modelo ou assunto). */
export function CountTiles({ label, total, tiles }: { label: string; total: CountTile; tiles: CountTile[] }) {
  return (
    <ul aria-label={label} className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {[total, ...tiles].map((tile) => (
        <li key={tile.label} className="rounded-2xl border border-border bg-surface px-4 py-3">
          <span className="block text-2xl font-bold tabular-nums text-ink">{number.format(tile.count)}</span>
          <span className="mt-0.5 block text-xs font-medium text-fg-muted">{tile.label}</span>
        </li>
      ))}
    </ul>
  );
}
