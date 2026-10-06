// Episódios do podcast Equity Talks (YouTube), exibidos no carrossel da home.
// Não mudam com o idioma: os episódios são gravados em português.

export type Episode = {
  /** Número do episódio, igual ao "EP 0XX" da thumbnail. */
  number: number;
  /** Título escrito na thumbnail. */
  title: string;
  /** Thumbnail 1280×720 em /public. */
  thumbnail: string;
  /** Link do episódio no YouTube; sem ele, a thumbnail aparece sem link. */
  youtubeUrl?: string;
};

function episode(number: number, title: string, youtubeId: string): Episode {
  return {
    number,
    title,
    thumbnail: `/media/episodes/equity-talks-${String(number).padStart(3, "0")}-1280.webp`,
    youtubeUrl: `https://youtu.be/${youtubeId}`,
  };
}

// Do mais recente para o mais antigo.
// TODO(content): o episódio 28 (youtu.be/A6wgjew446U) ainda não tem thumbnail.
export const episodes: readonly Episode[] = [
  episode(32, "Vender a sua empresa é sinal de derrota ou de sucesso?", "bAdRA9LK88o"),
  episode(31, "A virada histórica: o segredo da pivotação", "inSIzD1Hh6k"),
  episode(30, "O maior erro dos empreendedores ao tentar gerar equity", "C3egR831630"),
  episode(29, "Por que o mais conhecido sempre vence o melhor?", "ID8IOmDGeI8"),
  episode(27, "Como ficar rico fazendo o cliente economizar", "8jElzWYQMwU"),
  episode(26, "A trajetória de operadora de caixa aos 10 anos à diretoria", "D1g29BJNzyI"),
  episode(25, "Sua empresa é o seu patrimônio, não apenas o seu emprego!", "ec8SiGsnKpo"),
  episode(24, "Eu não tinha dinheiro nem pro estacionamento", "Z_etZFc2QKU"),
  episode(23, "Saiba o ponto exato onde o seu negócio está hoje", "Za9COtLHffo"),
  episode(22, "A história que você não conta impede o aumento do seu ticket médio", "MY7gB_RDqB4"),
  episode(21, "Até quando você vai aceitar receber R$ 12 por atendimento?", "RIjicso1pV4"),
  episode(20, "A estratégia secreta para faturar milhões em casal", "pWw3XRRQI6A"),
];
