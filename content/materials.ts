import type { Locale } from "@/i18n/routing";
import type { Widen } from "./types";
import { materialsUi as enUS } from "./en-US/materials";
import { materialsUi as ptBR } from "./pt-BR/materials";

// Materiais gratuitos: catálogo (/materiais) + uma landing page por material
// (/materiais/<slug>) com descritivo e formulário de captura do lead.
// Textos das LPs vindos das páginas atuais em vispe.com.br (só em português,
// como o blog). Imagens em public/media/materials/.

export type MaterialImage = { src: string; width: number; height: number };

export type Material = {
  slug: string;
  /** Formato exibido no card e no topo da LP. */
  type: string;
  title: string;
  /** Chamada curta da capa (usada no card e como descrição de SEO quando falta `intro`). */
  tagline: string;
  /** Capa 842×595 do catálogo (arte da Vispe com título). */
  cover: MaterialImage;
  /** Mockup do material em destaque na LP (sem ele, usa a capa). */
  mockup?: MaterialImage;
  /** Linha acima do título da LP (ex.: "E-book gratuito · Planejamento tributário"). */
  eyebrow?: string;
  /** Título (h1) da LP; sem ele, usa `title`. */
  headline?: string;
  intro?: string;
  /** Frase acima do formulário. */
  formCall?: string;
  features?: readonly { title: string; text?: string }[];
  usage?: {
    title: string;
    paragraphs: readonly string[];
    table: { columns: readonly string[]; rows: readonly (readonly string[])[] };
  };
  faq?: readonly { question: string; answer: string }[];
};

const cover = (slug: string): MaterialImage => ({ src: `/media/materials/${slug}-cover-842.webp`, width: 842, height: 595 });
const mockup = (slug: string, height: number): MaterialImage => ({
  src: `/media/materials/${slug}-mockup-1200.webp`,
  width: 1200,
  height,
});

const freeAnswer = "Sim, 100% gratuito.";

export const materials: readonly Material[] = [
  {
    slug: "checklist-reforma-tributaria",
    type: "Checklist",
    title: "Checklist de transição para a Reforma Tributária",
    tagline: "Roteiro prático e estratégico para proteger seu caixa e garantir a conformidade.",
    cover: cover("checklist-reforma-tributaria"),
    mockup: mockup("checklist-reforma-tributaria", 1194),
    eyebrow: "E-book gratuito · Planejamento tributário",
    headline: "Roteiro prático e estratégico para proteger seu caixa e garantir a conformidade na Reforma Tributária",
    intro:
      "Entender a teoria da nova legislação não garante que sua empresa continuará lucrativa. O desafio real é preparar seus sistemas, rever preços, adaptar o fluxo financeiro ao Split Payment e escolher o regime tributário certo antes dos prazos fatais. O Checklist de Transição resolve isso.",
    formCall: "Preencha o formulário para receber o PDF no seu e-mail!",
    features: [
      { title: "Auditoria do Ano-Teste", text: "Como validar emissão de IBS/CBS e cadastro mestre no ERP" },
      { title: "Prazos Legais Críticos", text: "Matriz de tomada de decisão para o Simples Híbrido" },
      { title: "Modelagem de Caixa & Split Payment", text: "Preparação financeira para a retenção na fonte da CBS" },
      { title: "Ajustes em Contratos e Precificação", text: "Como repassar a nova carga B2B/B2C sem perder margem" },
      { title: "Sistemas, Compliance & KPIs", text: "Checklist de virada de chave para equipe fiscal e TI" },
    ],
    usage: {
      title: "Desenhado para ser o seu guia operacional contínuo, não uma leitura teórica",
      paragraphs: [
        "Cada pilar do guia traz checklists acionáveis com etapas passo a passo organizadas em ordem cronológica. A transição tributária não acontece do dia para a noite, requer ajustes contínuos de sistemas, contratos e modelagem financeira para manter sua empresa saudável e capitalizada.",
      ],
      table: {
        columns: ["Etapa / foco", "Frequência", "Prioridade", "Foco da ação"],
        rows: [
          ["Auditoria de Cadastro & ERP", "Mensal / Trimestral", "Alta", "Eliminação de erros de IBS/CBS e NCM"],
          ["Opção pelo Simples Híbrido", "Prazo Fixo (Setembro)", "Crítica (Legal)", "Simulação de competitividade B2B"],
          ["Impacto do Split Payment no Caixa", "Mensal", "Crítica", "Projeção de retenção imediata em PIX/Cartão"],
          ["Repaginação de Contratos Longos", "Semestral", "Média", "Inclusão de cláusulas de IBS, CBS e IS"],
        ],
      },
    },
    faq: [
      {
        question: "Este checklist é indicado para qual porte de empresa?",
        answer:
          "O material foi desenhado especificamente para CEOs, CFOs, diretores e gestores fiscais de Pequenas e Médias Empresas (PMEs) dos segmentos de Indústria, Comércio, Serviços, E-commerce e Tecnologia. Se a sua empresa emite notas fiscais e precisa se adequar às novas regras de IBS/CBS, este guia é essencial.",
      },
      {
        question: "Minha contabilidade externa já não cuida da Reforma Tributária?",
        answer:
          "A contabilidade externa cuida do cumprimento das obrigações fiscais. No entanto, decisões estratégicas sobre margem de lucro, precificação de produtos, alteração de contratos B2B e impacto do Split Payment no caixa são de responsabilidade da gestão interna e da controladoria do negócio.",
      },
      {
        question: "Por que a decisão do Simples Híbrido precisa ser tomada até setembro?",
        answer:
          "A legislação exige que a opção pelo modelo Híbrido (no qual a empresa recolhe o IBS/CBS por fora para transferir créditos integrais a clientes B2B) seja formalizada com antecedência. A escolha é irretratável e exige simulação numérica prévia para não destruir sua margem.",
      },
      {
        question: "O e-book é realmente gratuito? Terei que pagar algo depois?",
        answer: `${freeAnswer} A Vispe Capital disponibiliza este manual operacional em PDF como parte do nosso compromisso de entregar inteligência financeira e planejamento tributário estratégico para PMEs brasileiras.`,
      },
      {
        question: "Como a Vispe Capital pode ajudar minha empresa além do e-book?",
        answer:
          "Atuamos na modelagem financeira para a Reforma Tributária, simulação do Simples Híbrido vs. Regular, reestruturação de controladoria e CFO as a Service. Ajudamos seu negócio a antecipar cenários e blindar a lucratividade durante toda a transição.",
      },
    ],
  },
  {
    slug: "dre-caixa",
    type: "Planilha",
    title: "Demonstrativo de Resultados do Exercício (DRE)",
    tagline: "Execute a análise dos dados agora!",
    cover: cover("dre-caixa"),
    mockup: mockup("dre-caixa", 800),
    eyebrow: "Planilha gratuita · Controladoria & fluxo de caixa",
    headline: "Descubra para onde seu dinheiro realmente vai com a Planilha Prática de DRE CAIXA",
    intro:
      "Vender muito no papel não paga as contas do fim do mês. O segredo de uma empresa saudável é controlar a entrada e saída efetiva de dinheiro no momento exato em que ocorrem. A DRE CAIXA organiza suas finanças pelo Princípio de Caixa, revelando a sobra real e eliminando o sangramento financeiro oculto.",
    formCall: "Preencha o formulário para receber a planilha pré-programada gratuitamente no seu e-mail!",
    features: [
      { title: "Estrutura Pronta pelo Princípio de Caixa", text: "Acompanhe o dinheiro real que entrou e saiu mês a mês" },
      {
        title: "Totalizadores Automatizados",
        text: "Fórmulas pré-configuradas para Receita Líquida, Lucro Bruto, Margem de Contribuição e EBITDA",
      },
      {
        title: "Separação Rígida de Gastos",
        text: "Classificação transparente entre Custos Diretos, Despesas de Vendas/Marketing e G&A",
      },
      {
        title: "Ajustes de CAPEX & Passivos",
        text: "Visão clara de amortização de empréstimos, dividendos e investimentos patrimoniais",
      },
      {
        title: "Indicadores de Saúde Financeira",
        text: "Cálculo instantâneo da Margem de Caixa Operacional e Caixa Final",
      },
    ],
    usage: {
      title: "Desenhada para uso diário e tomada de decisão rápida, sem complicações",
      paragraphs: [
        "O modelo é 100% editável e personalizável para a realidade do seu negócio. Basta renomear as linhas de acordo com suas receitas e despesas, preencher os lançamentos mensais e deixar que os totalizadores automáticos façam o cálculo das suas margens em tempo real.",
      ],
      table: {
        columns: ["Indicador", "Frequência", "Prioridade", "Objetivo na planilha"],
        rows: [
          ["Receita Líquida Real", "Mensal", "Alta", "Entradas operacionais deduzidas de impostos diretos e descontos"],
          ["Margem de Contribuição", "Mensal", "Alta", "Mede quanto sobrou para cobrir a estrutura fixa após custos e vendas"],
          ["EBITDA Operacional", "Mensal", "Alta", "Mede a capacidade de geração de caixa das operações principais"],
          ["Fluxo de Caixa Operacional", "Semanal / Mensal", "Crítica", "Resultado após despesas financeiras, CAPEX e dívidas"],
          ["Caixa Final & Margem Final", "Semanal / Mensal", "Crítica", "Saldo líquido real disponível para investimento ou distribuição"],
        ],
      },
    },
    faq: [
      {
        question: "Qual a diferença entre DRE Contábil e DRE CAIXA?",
        answer:
          "A DRE Contábil funciona por regime de competência (data em que a venda foi realizada ou a nota emitida). A DRE CAIXA opera por regime de caixa, considerando estritamente o dinheiro que efetivamente entrou na conta ou foi pago no mês, refletindo a sobra real da tesouraria.",
      },
      {
        question: "Preciso ter conhecimentos avançados de Excel para usar a planilha?",
        answer:
          "Não. A planilha conta com explicações passo a passo em cada linha, estrutura visual clara e fórmulas pré-programadas. Você só precisa preencher os dados do seu negócio e adaptar as categorias.",
      },
      {
        question: "A planilha serve para o meu tipo de empresa?",
        answer:
          "Sim. O modelo é versátil e atende empresas de Serviços, Comércio, E-commerce, Tecnologia e Pequenas Indústrias. Como o plano de contas é customizável, você adapta os nomes à sua realidade.",
      },
      {
        question: "O material é realmente gratuito? Terei que pagar algo depois?",
        answer: `${freeAnswer} A Vispe Capital disponibiliza este modelo pré-programado em Excel para apoiar empreendedores na estruturação de uma controladoria profissional e previsível.`,
      },
      {
        question: "Como a Vispe Capital pode ajudar minha empresa além do modelo DRE?",
        answer:
          "Atuamos na reestruturação de controladoria, parametrização de ERPs, planejamento orçamentário e gestão de CFO as a Service para PMEs que desejam aumentar a lucratividade e o valuation do negócio.",
      },
    ],
  },
  // TODO(content): os quatro materiais abaixo ainda não têm LP no site atual
  // (o card levava para /contato). Faltam descritivo, tópicos e FAQ; por ora a
  // página mostra a capa, a chamada da capa e o formulário.
  {
    slug: "como-aumentar-o-valor-da-empresa",
    type: "Guia prático",
    title: "Como aumentar o valor da sua empresa",
    tagline: "Guia prático para PMEs.",
    cover: cover("como-aumentar-o-valor-da-empresa"),
  },
  {
    slug: "devo-tomar-divida",
    type: "Planilha",
    title: "Devo tomar dívida?",
    tagline: "Otimize seu controle financeiro!",
    cover: cover("devo-tomar-divida"),
  },
  {
    slug: "caixa-preta-do-equity",
    type: "E-book",
    title: "A caixa preta do Equity",
    tagline: "Tenha acesso às principais estratégias de Equity e M&A.",
    cover: cover("caixa-preta-do-equity"),
  },
  {
    slug: "cemiterio-de-empresas",
    type: "E-book",
    title: "O cemitério de empresas",
    tagline: "Leia se você não quer que a sua empresa esteja aqui.",
    cover: cover("cemiterio-de-empresas"),
  },
  {
    slug: "arquitetura-do-lucro-real",
    type: "E-book",
    title: "A Arquitetura do Lucro Real",
    tagline: "O mapa completo para uma gestão por margem que funciona.",
    cover: cover("arquitetura-do-lucro-real"),
    mockup: mockup("arquitetura-do-lucro-real", 1194),
    eyebrow: "E-book gratuito · Controladoria",
    headline: "O mapa completo para uma gestão por margem que funciona",
    intro:
      "Saber que o DRE contábil não serve para decidir não é o problema. O problema é saber onde o caixa está sangrando primeiro, como separar custos de despesas e como transformar sua DRE num motor de Equity. A Arquitetura do Lucro Real resolve isso.",
    formCall: "Preencha o formulário para receber o PDF no seu e-mail!",
    features: [
      { title: "Cascata Gerencial de 20 passos" },
      { title: "Diagnóstico de DRE Contábil vs. Gerencial" },
      { title: "Separação de Custos, Vendas e G&A" },
      { title: "Cálculo real de EBITDA e Valuation" },
      { title: "Reconciliação com o Fluxo de Caixa Final" },
      { title: "Protocolo de leitura em 5 minutos" },
    ],
    usage: {
      title: "Desenhado para uso contínuo, não como leitura única",
      paragraphs: [
        "Cada capítulo traz uma visão clara de diagnóstico para acompanhar o progresso e uma estrutura passo a passo com checklists para aplicar à sua rotina. As prioridades financeiras não são feitas em linha reta — você pode ajustar seu DRE gerencial conforme o momento e o porte do seu negócio.",
        "A distinção entre margem econômica e saldo de tesouraria é o aspecto mais importante: algumas métricas avaliam a eficiência das vendas, enquanto outras exigem revisão de caixa para manter a empresa saudável e capitalizada.",
      ],
      table: {
        columns: ["Indicador", "Frequência", "Prioridade"],
        rows: [
          ["Margem Bruta (CPV/CMV)", "Mensal", "Alta"],
          ["Linha de Contribuição & CAC", "Trimestral / Mensal", "Alta"],
          ["Margem EBITDA Operacional", "Mensal", "Alta"],
          ["Resultado Financeiro & Taxas", "Mensal", "Média"],
          ["Variável de Caixa Final (CAPEX)", "Semanal / Mensal", "Crítica"],
        ],
      },
    },
    faq: [
      {
        question: "Este e-book é indicado para qual porte ou segmento de empresa?",
        answer:
          "O material foi desenvolvido especificamente para fundadores, diretores e gestores financeiros de PMEs (Pequenas e Médias Empresas) de qualquer segmento — indústrias, comércio, e-commerce, tecnologia (SaaS) ou empresas de serviços. Se a sua operação possui faturamento ativo e você busca clareza sobre suas margens e controle do caixa, este guia é para você.",
      },
      {
        question: "Por que o DRE que recebo do meu contador não serve para a gestão do dia a dia?",
        answer:
          "O DRE Contábil Tradicional cumpre uma obrigação técnica perante a Receita Federal (foco fiscal e tributário). Ele agrupa custos e despesas em blocos genéricos e opera por regime de competência pura, ocultando a geração real de caixa, o custo de aquisição de clientes (CAC) e o EBITDA da operação. O DRE Gerencial reorganiza esses dados para revelar onde a empresa ganha ou perde margem na prática.",
      },
      {
        question: "O e-book é realmente gratuito? Terei que pagar algo depois?",
        answer: `${freeAnswer} A Vispe Capital disponibiliza este manual prático em PDF como parte do nosso compromisso de democratizar a controladoria de alta performance e a cultura de Equity para PMEs no Brasil. Você não precisa cadastrar cartão de crédito para acessar.`,
      },
      {
        question: "Preciso trocar de software de gestão (ERP) para aplicar a DRE Gerencial?",
        answer:
          "Não. O DRE Gerencial é uma estrutura metodológica de análise, e não um software específico. O e-book ensina a lógica de parametrização e o plano de contas gerencial que você pode aplicar no seu ERP atual, em planilhas ou em ferramentas de Business Intelligence (BI).",
      },
      {
        question: "O que é o “Protocolo de 5 Minutos” abordado no livro?",
        answer:
          "É um método de escaneamento executivo desenvolvido pela Vispe para que o CEO/CFO consiga diagnosticar a saúde financeira do negócio no início do mês sem perder horas analisando planilhas. Ele foca em 5 indicadores-chave de margem percentual que revelam instantaneamente qualquer vazamento de caixa.",
      },
      {
        question: "Como receberei o e-book após preencher o formulário?",
        answer:
          "O acesso é imediato. Assim que você preencher o formulário, enviaremos o link de download direto para o seu e-mail cadastrado em formato PDF otimizado para leitura em computador, tablet ou e-reader.",
      },
      {
        question: "Como a Vispe Capital pode ajudar minha empresa além do e-book?",
        answer:
          "Além de materiais educativos, a Vispe Capital atua na reestruturação de controladoria, parametrização financeira e gestão estratégica de margem (CFO as a Service) para empresas que buscam gerar previsibilidade de caixa e multiplicar seu valor de mercado (Valuation/Equity). Você pode agendar uma sessão de diagnóstico direto com nossos especialistas após o download do e-book.",
      },
    ],
  },
  {
    slug: "checklist-preparacao-ma",
    type: "Checklist",
    title: "Checklist de preparação para M&A",
    tagline: "Venda sua empresa pelo preço máximo!",
    cover: cover("checklist-preparacao-ma"),
    mockup: mockup("checklist-preparacao-ma", 1194),
    eyebrow: "E-book gratuito · M&A & estratégia de Equity",
    headline: "O guia definitivo para preparar sua empresa, maximizar o Valuation e atrair os melhores compradores",
    intro:
      "Preparar uma empresa para Fusões e Aquisições (M&A) é como treinar um atleta para uma final de campeonato: a vitória é decidida muito antes de entrar em campo. Um negócio bem preparado reduz riscos de Due Diligence, acelera a negociação e impede que descontos severos destruam o valor da sua transação. A Vispe Capital estruturou o roteiro definitivo de “arrumação da casa”.",
    formCall: "Preencha o formulário para receber o Checklist de Preparação para M&A em PDF no seu e-mail!",
    features: [
      {
        title: "Governança e Estrutura Jurídica",
        text: "Auditoria de acordos de sócios (drag/tag along), marcas e contratos-chave",
      },
      {
        title: "Cálculo do EBITDA Normalizado",
        text: "Como expurgar despesas pessoais e não recorrentes para defender seu Valuation",
      },
      {
        title: "Capital de Giro & Projeções",
        text: "Definição do alvo de NCG e construção da história de crescimento (Equity Story)",
      },
      {
        title: "Risco Operacional & Pessoas",
        text: "Redução da dependência de sócios e mapeamento de passivos trabalhistas",
      },
      {
        title: "Dicas Práticas Imediatas",
        text: "Guia direto para o empresário pensar como comprador e montar seu “Conselho de Guerra”",
      },
    ],
    usage: {
      title: "O roteiro para transformar sua empresa em um ativo altamente líquido",
      paragraphs: [
        "O checklist foi desenhado para ser executado em etapas estratégicas antes do primeiro contato com fundos de investimento ou compradores estratégicos. Organizar dados contábeis, societários e trabalhistas previamente evita a perda de tempo e o insucesso do processo de venda.",
      ],
      table: {
        columns: ["Pilar de auditoria", "Frequência", "Prioridade", "Objetivo no processo de M&A"],
        rows: [
          ["Governança & Contratos Societários", "Etapa Inicial", "Crítica", "Mapear drag along, tag along, certidões e marcas em nome da empresa"],
          ["EBITDA Normalizado & DRE", "Mensal / Histórico", "Alta", "Eliminar despesas pessoais de sócios e defender a margem real negociada"],
          ["Business Plan & Projeções (3-5 anos)", "Anual", "Alta", "Consolidar a tese de crescimento e retorno financeiro para o investidor"],
          ["Mapeamento de Passivos Trabalhistas", "Trimestral", "Média", "Eliminar riscos ocultos e acordos verbais com equipe e fornecedores"],
        ],
      },
    },
    faq: [
      {
        question: "O que é Vendor Readiness e por que é fundamental em M&A?",
        answer:
          "Vendor Readiness é a preparação prévia do vendedor antes de ir ao mercado. Consiste na auditoria interna de finanças, contratos e governança para identificar e corrigir falhas com antecedência, evitando que o comprador exija descontos expressivos no valuation durante a Due Diligence.",
      },
      {
        question: "O que é EBITDA Normalizado e por que ele é central na venda?",
        answer:
          "É o EBITDA operacional limpo de despesas e receitas não recorrentes (como despesas pessoais dos sócios ou venda pontual de um imóvel). Como o preço final da transação costuma ser um múltiplo do EBITDA, quanto mais organizado e defendível for esse número, maior o valor de venda.",
      },
      {
        question: "Quando devo começar a preparar minha empresa para uma venda?",
        answer:
          "O ideal é iniciar o processo de “arrumação da casa” de 12 a 24 meses antes do momento desejado para a venda. Isso garante tempo suficiente para normalizar balanços, profissionalizar a equipe e construir uma história de crescimento sólida.",
      },
      {
        question: "O e-book é gratuito? Terei custos posteriores?",
        answer: `${freeAnswer} A Vispe Capital disponibiliza este guia como parte do compromisso com a cultura de Equity e preparação executiva no Brasil.`,
      },
      {
        question: "Como a Vispe Capital assessora meu processo de M&A?",
        answer:
          "Atuamos como seu Advisor financeiro e estratégico, conduzindo a avaliação de Valuation, preparação do Data Room, prospecção de compradores elegíveis, condução de Due Diligence e negociação final dos termos da transação.",
      },
    ],
  },
];

export function getMaterial(slug: string): Material | undefined {
  return materials.find((material) => material.slug === slug);
}

// Textos de interface (por idioma).

export type MaterialsUi = Widen<typeof ptBR>;

const uiByLocale: Record<Locale, MaterialsUi> = { "pt-BR": ptBR, "en-US": enUS };

export function getMaterialsUi(locale: Locale): MaterialsUi {
  return uiByLocale[locale];
}
