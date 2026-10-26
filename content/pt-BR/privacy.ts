// Política de Privacidade (/politica-de-privacidade).
// TODO(content): preencher os campos entre [colchetes] e passar o texto pelo
// jurídico antes de publicar. Atualizar a lista de fornecedores sempre que
// entrar ou sair uma ferramenta (pixels em lib/tracking, formulários em lib/forms).

type PrivacyItem = { label: string; text: string };

export const privacy = {
  title: "Política de Privacidade",
  description:
    "Como a Vispe Capital coleta, usa e protege os seus dados pessoais no site, nos formulários e nos cookies, e como exercer os seus direitos pela LGPD.",
  breadcrumb: "Política de Privacidade",
  updated: "Última atualização: [data da publicação]",
  intro:
    "Esta Política de Privacidade explica quais dados pessoais são coletados neste site (vispecapital.com), que pertence a [razão social], inscrita no CNPJ sob o nº [CNPJ], com sede em [endereço completo] (\"Vispe Capital\"). Ela também informa para que esses dados são usados, com quem são compartilhados e como você pode exercer os seus direitos previstos na Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD). Leia com atenção.",
  cookiesButton: "Abrir preferências de cookies",
  sections: [
    {
      id: "controlador",
      title: "Responsável pelos seus dados",
      paragraphs: [
        "A Vispe Capital é a controladora dos dados pessoais tratados neste site. O encarregado pelo tratamento de dados (DPO) é [nome do encarregado], que atende pelo e-mail [e-mail do encarregado].",
      ],
    },
    {
      id: "dados",
      title: "Quais dados coletamos",
      paragraphs: ["Coletamos apenas o necessário para cada finalidade:"],
      items: [
        {
          label: "Formulários",
          text: "nome, e-mail, telefone, empresa, cargo, faixa de faturamento, segmento, mensagem e, no formulário de carreiras, o currículo enviado.",
        },
        {
          label: "Navegação",
          text: "com o seu consentimento, páginas visitadas, origem da visita (por exemplo, anúncio ou busca), parâmetros de campanha (UTM), tipo de aparelho e navegador, e localização aproximada a partir do endereço IP.",
        },
        {
          label: "Identificadores",
          text: "códigos de cookies e de cliques em anúncios das plataformas de marketing descritas abaixo, também só com o seu consentimento.",
        },
      ],
    },
    {
      id: "finalidades",
      title: "Para que usamos os dados",
      items: [
        { label: "Atendimento", text: "responder ao seu contato, agendar o diagnóstico e apresentar propostas, a seu pedido." },
        { label: "Materiais gratuitos", text: "enviar por e-mail os materiais que você solicitar." },
        { label: "Carreiras", text: "avaliar candidaturas a vagas." },
        { label: "Análise", text: "entender como o site é usado e melhorar páginas e conteúdos (cookies de análise, com consentimento)." },
        {
          label: "Marketing",
          text: "medir o resultado de campanhas e mostrar anúncios da Vispe Capital a quem já visitou o site (cookies de marketing, com consentimento).",
        },
        { label: "Obrigações legais e segurança", text: "cumprir a lei e proteger o site contra fraudes e abusos." },
      ] as PrivacyItem[],
    },
    {
      id: "cookies",
      title: "Uso de cookies",
      paragraphs: [
        "Cookies são pequenos arquivos guardados no seu navegador. Os essenciais funcionam sempre, porque sem eles o site não funciona direito; os de análise e de marketing só são ativados se você permitir, e você pode mudar a sua escolha a qualquer momento.",
      ],
      items: [
        { label: "Essenciais", text: "guardam a sua escolha sobre cookies (vispe_consent) e o idioma escolhido no seletor (vispe_lang)." },
        { label: "Análise", text: "Google Analytics, para estatísticas de uso do site." },
        {
          label: "Marketing",
          text: "Meta Pixel (Facebook e Instagram), LinkedIn Insight Tag e Google Ads, para medir campanhas e formar públicos de anúncios. Quando você envia um formulário com o marketing permitido, o e-mail, o telefone e o nome também podem ser enviados à Meta de forma criptografada (hash), só para relacionar o envio ao anúncio que o originou.",
        },
      ],
    },
    {
      id: "midia",
      title: "Mídia incorporada",
      paragraphs: [
        "Alguns vídeos do site são exibidos a partir do YouTube, no modo de privacidade aprimorada. Eles só são carregados quando aparecem na tela ou quando você dá play, e seguem a política de privacidade do Google.",
      ],
    },
    {
      id: "compartilhamento",
      title: "Compartilhamento de dados",
      paragraphs: [
        "Não vendemos dados pessoais. Compartilhamos apenas com fornecedores que nos ajudam a operar o site e os nossos serviços, cada um para a sua finalidade:",
      ],
      items: [
        { label: "Hostinger", text: "hospedagem do site." },
        { label: "Google (Planilhas, Drive e Gmail)", text: "registro dos formulários, guarda de currículos e envio de e-mails." },
        { label: "Supabase", text: "banco de dados e arquivos do site (conteúdos, materiais e imagens)." },
        { label: "Meta, LinkedIn e Google", text: "plataformas de análise e de anúncios, só com o seu consentimento." },
        { label: "Autoridades públicas", text: "quando exigido por lei ou ordem judicial." },
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
      id: "seguranca",
      title: "Acesso e segurança",
      paragraphs: [
        "Somente pessoas autorizadas da Vispe Capital têm acesso aos seus dados pessoais. Adotamos medidas técnicas e administrativas para protegê-los contra acessos não autorizados e situações acidentais ou ilícitas, como conexão criptografada (HTTPS), acesso restrito e links de download que expiram.",
      ],
    },
    {
      id: "direitos",
      title: "Quais são os seus direitos",
      items: [
        { label: "Confirmação e acesso", text: "saber se tratamos os seus dados e acessá-los." },
        { label: "Correção", text: "corrigir dados incompletos, inexatos ou desatualizados." },
        {
          label: "Anonimização, bloqueio ou eliminação",
          text: "de dados desnecessários, excessivos ou tratados em desacordo com a lei.",
        },
        { label: "Portabilidade", text: "levar os seus dados a outro fornecedor de serviço." },
        { label: "Informação", text: "saber com quem compartilhamos os seus dados." },
        {
          label: "Revogação do consentimento",
          text: "retirar o consentimento a qualquer momento e pedir a eliminação dos dados tratados com base nele.",
        },
      ],
      after:
        "Para exercer qualquer um desses direitos, escreva para [e-mail do encarregado], dizendo claramente o que você precisa. Para a sua segurança, podemos confirmar a sua identidade antes de atender ao pedido. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).",
    },
    {
      id: "alteracoes",
      title: "Mudanças nesta política",
      paragraphs: [
        "Esta política pode ser atualizada. A data da última atualização fica no fim da página, e mudanças relevantes serão informadas no site.",
      ],
    },
    {
      id: "lei",
      title: "Lei aplicável",
      paragraphs: [
        "Esta política é regida pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de [cidade/UF] para resolver qualquer questão relacionada a ela.",
      ],
    },
  ] as { id: string; title: string; paragraphs?: string[]; items?: PrivacyItem[]; after?: string }[],
  closing:
    "Dúvidas, discordâncias ou sugestões sobre esta Política de Privacidade podem ser enviadas para [e-mail do encarregado]. Estamos em [endereço completo].",
};
