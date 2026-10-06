/**
 * "Alarga" os literais de um objeto `as const` (string, número, boolean)
 * mantendo a estrutura. Usado para tipar a versão em inglês do conteúdo a
 * partir da versão em português: mesmos campos, textos livres.
 */
export type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : T extends object
          ? { readonly [K in keyof T]: Widen<T[K]> }
          : T;

/** Substitui {chave} no texto: format("Grupo {n}", { n: 2 }). */
export function format(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** Depoimento de cliente (seção Feedbacks). Todos os extras são opcionais. */
export type Testimonial = {
  quote: string;
  /** Nome da empresa (ou da pessoa). */
  name: string;
  /** Segmento da empresa, exibido abaixo do nome (ex.: "Provedor de internet"). */
  segment?: string;
  /** Foto de perfil em /public (ex.: "/media/clients/aonet.png"). Sem ela, mostra a inicial. */
  avatar?: string;
  /** URLs do cliente; cada ícone só vira link quando a URL existe. */
  instagram?: string;
  website?: string;
  /** Foto anexada ao depoimento, exibida no corpo do card. */
  media?: { src: string; alt: string; width: number; height: number };
};
