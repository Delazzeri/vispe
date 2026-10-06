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

function thumbnail(number: number) {
  return `/media/episodes/equity-talks-${String(number).padStart(3, "0")}-1280.webp`;
}

// Do mais recente para o mais antigo.
// TODO(content): preencher youtubeUrl de cada episódio.
export const episodes: readonly Episode[] = [
  { number: 32, title: "Vender a sua empresa é sinal de derrota ou de sucesso?", thumbnail: thumbnail(32) },
  { number: 31, title: "A virada histórica: o segredo da pivotação", thumbnail: thumbnail(31) },
  { number: 30, title: "O maior erro dos empreendedores ao tentar gerar equity", thumbnail: thumbnail(30) },
  { number: 29, title: "Por que o mais conhecido sempre vence o melhor?", thumbnail: thumbnail(29) },
  { number: 27, title: "Como ficar rico fazendo o cliente economizar", thumbnail: thumbnail(27) },
  { number: 26, title: "A trajetória de operadora de caixa aos 10 anos à diretoria", thumbnail: thumbnail(26) },
  { number: 25, title: "Sua empresa é o seu patrimônio, não apenas o seu emprego!", thumbnail: thumbnail(25) },
  { number: 24, title: "Eu não tinha dinheiro nem pro estacionamento", thumbnail: thumbnail(24) },
  { number: 23, title: "Saiba o ponto exato onde o seu negócio está hoje", thumbnail: thumbnail(23) },
  { number: 22, title: "A história que você não conta impede o aumento do seu ticket médio", thumbnail: thumbnail(22) },
  { number: 21, title: "Até quando você vai aceitar receber R$ 12 por atendimento?", thumbnail: thumbnail(21) },
  { number: 20, title: "A estratégia secreta para faturar milhões em casal", thumbnail: thumbnail(20) },
];
