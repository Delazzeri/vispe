// Política de Privacidade (/privacidade).
// TODO(content): preencher os campos entre [colchetes] e passar o texto pelo
// jurídico antes de publicar. Atualizar a lista de fornecedores sempre que
// entrar ou sair uma ferramenta (pixels em lib/tracking, formulários em lib/forms).

export const privacy = {
  title: "Política de Privacidade",
  description:
    "Como a Vispe Capital coleta, usa e protege os seus dados pessoais no site, nos formulários e nos cookies, e como exercer os seus direitos pela LGPD.",
  breadcrumb: "Política de Privacidade",
  updated: "Última atualização: [data da publicação]",
  intro:
    "Esta política explica quais dados pessoais a Vispe Capital coleta quando você usa este site, para que eles são usados, com quem são compartilhados e como você pode exercer os seus direitos previstos na Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).",
  cookiesButton: "Abrir preferências de cookies",
  sections: [
    {
      id: "controlador",
      title: "Quem é o responsável pelos seus dados",
      paragraphs: [
        "O controlador dos dados é [razão social], inscrita no CNPJ sob o nº [CNPJ], com sede em [endereço completo] (\"Vispe Capital\").",
        "Encarregado pelo tratamento de dados (DPO): [nome do encarregado], pelo e-mail [e-mail do encarregado].",
      ],
    },
    {
      id: "dados",
      title: "Quais dados coletamos",
      paragraphs: ["Coletamos apenas o necessário para cada finalidade:"],
      list: [
        "Dados que você informa nos formulários: nome, e-mail, telefone, empresa, cargo, faixa de faturamento, segmento, mensagem e, no formulário de carreiras, o currículo enviado.",
        "Dados de navegação, com o seu consentimento: páginas visitadas, origem da visita (por exemplo, anúncio ou busca), parâmetros de campanha (UTM), tipo de aparelho e navegador, e localização aproximada a partir do endereço IP.",
        "Identificadores de cookies e de cliques em anúncios das plataformas de marketing descritas abaixo, também só com o seu consentimento.",
      ],
    },
    {
      id: "finalidades",
      title: "Para que usamos os dados",
      list: [
        "Responder ao seu contato, agendar o diagnóstico e apresentar propostas (procedimentos preliminares a um contrato, a seu pedido).",
        "Enviar por e-mail os materiais gratuitos que você solicitar.",
        "Avaliar candidaturas a vagas.",
        "Entender como o site é usado e melhorar páginas e conteúdos (cookies de análise, com consentimento).",
        "Medir o resultado de campanhas e mostrar anúncios da Vispe Capital a quem já visitou o site (cookies de marketing, com consentimento).",
        "Cumprir obrigações legais e proteger o site contra fraudes e abusos (legítimo interesse e obrigação legal).",
      ],
    },
    {
      id: "cookies",
      title: "Cookies e tecnologias semelhantes",
      paragraphs: [
        "Os cookies essenciais funcionam sempre, porque sem eles o site não funciona direito. Os de análise e de marketing só são ativados se você permitir, e você pode mudar a sua escolha a qualquer momento.",
      ],
      list: [
        "Essenciais: guardam a sua escolha sobre cookies (vispe_consent) e o idioma escolhido no seletor (vispe_lang).",
        "Análise: Google Analytics, para estatísticas de uso do site.",
        "Marketing: Meta Pixel (Facebook e Instagram), LinkedIn Insight Tag e Google Ads, para medir campanhas e formar públicos de anúncios. Quando você envia um formulário com o marketing permitido, o e-mail, o telefone e o nome também podem ser enviados à Meta de forma criptografada (hash), só para relacionar o envio ao anúncio que o originou.",
      ],
    },
    {
      id: "compartilhamento",
      title: "Com quem compartilhamos",
      paragraphs: [
        "Não vendemos dados pessoais. Compartilhamos apenas com fornecedores que nos ajudam a operar o site e os nossos serviços, cada um para a sua finalidade:",
      ],
      list: [
        "Hostinger: hospedagem do site.",
        "Google (Planilhas, Drive e Gmail): registro dos formulários, guarda de currículos e envio de e-mails.",
        "Supabase: banco de dados e arquivos do site (conteúdos, materiais e imagens).",
        "Meta, LinkedIn e Google: plataformas de análise e de anúncios, só com o seu consentimento.",
        "Autoridades públicas, quando exigido por lei ou ordem judicial.",
      ],
    },
    {
      id: "transferencia",
      title: "Transferência internacional",
      paragraphs: [
        "Alguns desses fornecedores guardam dados fora do Brasil. Nesses casos, a transferência segue o que a LGPD exige, com fornecedores que adotam garantias adequadas de proteção.",
      ],
    },
    {
      id: "retencao",
      title: "Por quanto tempo guardamos",
      paragraphs: [
        "Guardamos os dados pelo tempo necessário para cada finalidade: contatos comerciais por [prazo], currículos por [prazo] e dados de navegação pelo prazo de cada plataforma. Depois disso, os dados são apagados ou anonimizados, salvo quando a lei exigir que sejam mantidos.",
      ],
    },
    {
      id: "direitos",
      title: "Os seus direitos",
      paragraphs: ["Pela LGPD, você pode, a qualquer momento:"],
      list: [
        "confirmar se tratamos os seus dados e acessá-los;",
        "corrigir dados incompletos, inexatos ou desatualizados;",
        "pedir a anonimização, o bloqueio ou a eliminação de dados desnecessários ou tratados em desacordo com a lei;",
        "pedir a portabilidade dos dados;",
        "saber com quem compartilhamos os seus dados;",
        "retirar o consentimento e pedir a eliminação dos dados tratados com base nele.",
      ],
      after: "Para exercer esses direitos, escreva para [e-mail do encarregado]. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).",
    },
    {
      id: "seguranca",
      title: "Segurança",
      paragraphs: [
        "Adotamos medidas técnicas e administrativas para proteger os dados, como conexão criptografada (HTTPS), acesso restrito à equipe autorizada e links de download que expiram.",
      ],
    },
    {
      id: "alteracoes",
      title: "Alterações nesta política",
      paragraphs: [
        "Esta política pode ser atualizada. A data da última atualização fica no topo da página, e mudanças relevantes serão informadas no site.",
      ],
    },
  ] as { id: string; title: string; paragraphs?: string[]; list?: string[]; after?: string }[],
};
