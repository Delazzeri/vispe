/**
 * Recebe os formulários do site da Vispe Capital e grava numa planilha Google,
 * uma aba por formulário (o site envia de lib/forms/submit.ts). No formulário
 * de material gratuito, também envia por e-mail um link de download que expira
 * (gerado pela Edge Function material-link do Supabase).
 *
 * Instalação (uma vez):
 *  1. Crie a planilha. As abas "diagnostico", "franquia", "materiais" e
 *     "carreiras" são criadas sozinhas, com cabeçalho, no primeiro envio.
 *  2. Extensões → Apps Script → cole este arquivo inteiro em Code.gs.
 *  3. Configurações do projeto (engrenagem) → Propriedades do script → adicione:
 *       RESUME_FOLDER_ID      ID da pasta do Drive dos currículos (trecho da URL
 *                             depois de /folders/; só a Vispe com acesso)
 *       MATERIAL_LINK_URL     https://<projeto>.supabase.co/functions/v1/material-link
 *       MATERIAL_LINK_SECRET  o mesmo segredo cadastrado na função, no Supabase
 *     Sem as duas últimas, o material só é registrado na planilha (sem e-mail).
 *  4. No editor, escolha a função "autorizar" na barra de cima e clique em Executar:
 *     o Google pede as permissões (planilha, Drive, e-mail e serviço externo).
 *     Rode de novo sempre que o código passar a usar um serviço novo.
 *  5. Implantar → Nova implantação → Tipo: App da Web.
 *       Executar como: Eu · Quem pode acessar: Qualquer pessoa.
 *     Autorize o acesso pedido (planilha, Drive, e-mail e conexões externas).
 *  6. Copie a URL do App da Web (termina em /exec) para NEXT_PUBLIC_FORMS_ENDPOINT
 *     no .env.local e gere o build do site de novo.
 * Mudou este código? Implantar → Gerenciar implantações → editar → Nova versão
 * (a URL continua a mesma).
 */

/** Configuração nas propriedades do script (fora do código: nada de IDs/segredos no Git). */
function config() {
  const props = PropertiesService.getScriptProperties();
  return {
    resumeFolderId: props.getProperty("RESUME_FOLDER_ID") || "",
    materialLinkUrl: props.getProperty("MATERIAL_LINK_URL") || "",
    materialLinkSecret: props.getProperty("MATERIAL_LINK_SECRET") || "",
  };
}

/** Colunas de cada aba: [campo enviado pelo site, título da coluna]. */
const SHEETS = {
  diagnostico: [
    ["name", "Nome"],
    ["email", "E-mail"],
    ["phone", "WhatsApp"],
    ["company", "Empresa"],
    ["segment", "Segmento"],
    ["revenue", "Faturamento mensal"],
    ["interest", "Interesse"],
    ["message", "Mensagem"],
  ],
  franquia: [
    ["model", "Modelo"],
    ["name", "Nome"],
    ["email", "E-mail"],
    ["phone", "WhatsApp"],
    ["city", "Cidade/UF"],
    ["background", "Formação/área"],
    ["capital", "Capital disponível"],
    ["message", "Mensagem"],
  ],
  materiais: [
    ["material", "Material"],
    ["name", "Nome"],
    ["email", "E-mail"],
    ["phone", "WhatsApp"],
    ["company", "Empresa"],
    ["segment", "Segmento"],
    ["revenue", "Faturamento mensal"],
    ["role", "Cargo"],
    ["pain", "Principal dor"],
    ["whatsapp", "Aceita WhatsApp"],
  ],
  carreiras: [
    ["name", "Nome"],
    ["email", "E-mail"],
    ["phone", "Telefone"],
    ["city", "Cidade/UF"],
    ["linkedin", "LinkedIn"],
    ["area", "Área"],
    ["roles", "Cargos"],
    ["roleOther", "Outro cargo"],
    ["message", "Mensagem"],
  ],
};

/** Textos do e-mail do material, no idioma da página onde a pessoa pediu. */
const MATERIAL_EMAIL = {
  "pt-BR": {
    subject: "Seu material gratuito: ",
    greeting: "Olá, {name}!",
    intro: "Obrigado pelo interesse. Seu material <strong>{title}</strong> está pronto para baixar:",
    button: "Baixar o material",
    expiry: "O link vale por {days} dias. Depois disso, é só pedir de novo no site.",
    signature: "Equipe Vispe Capital",
  },
  "en-US": {
    subject: "Your free material: ",
    greeting: "Hi, {name}!",
    intro: "Thanks for your interest. Your material <strong>{title}</strong> is ready to download:",
    button: "Download the material",
    expiry: "The link is valid for {days} days. After that, just request it again on the website.",
    signature: "The Vispe Capital team",
  },
};

const MAX_FIELD = 2000;
const MAX_RESUME_BYTES = 4 * 1024 * 1024;

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const columns = SHEETS[body.sheet];
    if (!columns) return json({ ok: false, error: "formulário desconhecido" });
    const values = body.values || {};
    if (values.consent !== "on") return json({ ok: false, error: "sem consentimento" });

    // Material: gera o link e manda o e-mail antes de gravar, para a linha já
    // registrar o título e o resultado do envio.
    const delivery = body.sheet === "materiais" ? sendMaterial(values) : null;

    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const sheet = sheetFor(body.sheet, columns);
      const extra = [];
      if (body.sheet === "carreiras") extra.push(saveResume(body.file, values.name));
      const after = delivery ? [clean(delivery.title), clean(delivery.status)] : [];
      sheet.appendRow([
        new Date(),
        ...columns.map(([key]) => clean(values[key])),
        ...extra,
        clean(values.locale),
        clean(body.page),
        ...after,
      ]);
    } finally {
      lock.releaseLock();
    }

    return json({ ok: true });
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: String(error) });
  }
}

/** Aba do formulário, com o cabeçalho atualizado (colunas novas entram no fim). */
function sheetFor(name, columns) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = book.getSheetByName(name) || book.insertSheet(name);
  const header = ["Recebido em", ...columns.map(([, title]) => title)];
  if (name === "carreiras") header.push("Currículo");
  header.push("Idioma", "Página");
  if (name === "materiais") header.push("Título do material", "Envio do link");
  const current = sheet.getLastColumn() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
  if (current.join("|") !== header.join("|")) {
    sheet.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Texto curto e sem fórmula: um valor que começa com = + - @ viraria fórmula na
 * planilha (injeção de fórmula), então ganha um apóstrofo na frente.
 */
function clean(value) {
  const text = String(value == null ? "" : value).slice(0, MAX_FIELD);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

/** Salva o PDF do candidato no Drive e devolve o link (só a Vispe acessa a pasta). */
function saveResume(file, name) {
  const folderId = config().resumeFolderId;
  if (!file || !file.base64 || !folderId) return "";
  const bytes = Utilities.base64Decode(file.base64);
  if (bytes.length > MAX_RESUME_BYTES) throw new Error("currículo acima de 4 MB");
  // Assinatura de PDF (%PDF-), não só a extensão.
  if (String.fromCharCode.apply(null, bytes.slice(0, 5).map((b) => (b + 256) % 256)) !== "%PDF-") {
    throw new Error("currículo não é PDF");
  }
  const stamp = Utilities.formatDate(new Date(), "America/Sao_Paulo", "yyyy-MM-dd HHmm");
  const safeName = String(name || "candidato").replace(/[^\p{L}\p{N} -]/gu, "").slice(0, 60);
  const blob = Utilities.newBlob(bytes, "application/pdf", `${stamp} - ${safeName}.pdf`);
  return DriveApp.getFolderById(folderId).createFile(blob).getUrl();
}

/**
 * Pede à Edge Function material-link um link de download que expira e envia por
 * e-mail. Devolve o título do material e o resultado, que vão para a planilha.
 */
function sendMaterial(values) {
  const { materialLinkUrl, materialLinkSecret } = config();
  if (!materialLinkUrl || !materialLinkSecret) return { title: "", status: "não configurado (propriedades do script)" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email || "")) return { title: "", status: "e-mail inválido" };

  try {
    const response = UrlFetchApp.fetch(materialLinkUrl, {
      method: "post",
      contentType: "application/json",
      headers: { "x-material-secret": materialLinkSecret },
      payload: JSON.stringify({ slug: values.material }),
      muteHttpExceptions: true,
    });
    const data = JSON.parse(response.getContentText() || "{}");
    if (response.getResponseCode() !== 200) return { title: "", status: "erro: " + (data.error || response.getResponseCode()) };
    if (!data.url) return { title: data.title, status: "sem arquivo no admin — enviar manualmente" };

    const text = MATERIAL_EMAIL[values.locale] || MATERIAL_EMAIL["pt-BR"];
    // Pedido pela versão em inglês: usa o título traduzido no admin, se houver.
    const displayTitle = String((values.locale === "en-US" && data.titleEn) || data.title);
    const fill = (template) =>
      template
        .replace("{name}", clean(values.name).replace(/[<>&"]/g, ""))
        .replace("{title}", displayTitle.replace(/[<>&"]/g, ""))
        .replace("{days}", String(data.expiresInDays));
    MailApp.sendEmail({
      to: values.email,
      subject: text.subject + displayTitle,
      name: "Vispe Capital",
      htmlBody:
        "<p>" + fill(text.greeting) + "</p>" +
        "<p>" + fill(text.intro) + "</p>" +
        '<p><a href="' + data.url + '" style="display:inline-block;padding:12px 20px;background:#000;color:#fff;border-radius:10px;text-decoration:none;font-weight:600">' + text.button + "</a></p>" +
        '<p style="color:#595959;font-size:13px">' + fill(text.expiry) + "</p>" +
        "<p>" + text.signature + "</p>",
    });
    return { title: data.title, status: "link enviado (" + data.expiresInDays + " dias)" };
  } catch (error) {
    console.error(error);
    return { title: "", status: "erro: " + String(error).slice(0, 120) };
  }
}

/**
 * Rode uma vez no editor (Executar → autorizar) para o Google pedir todas as
 * permissões que o App da Web usa. Sem isso, a chamada ao Supabase falha com
 * "Você não tem permissão para chamar UrlFetchApp.fetch".
 */
function autorizar() {
  SpreadsheetApp.getActiveSpreadsheet().getName();
  const { resumeFolderId, materialLinkUrl } = config();
  if (resumeFolderId) DriveApp.getFolderById(resumeFolderId).getName();
  console.log("E-mails restantes hoje:", MailApp.getRemainingDailyQuota());
  if (materialLinkUrl) {
    const status = UrlFetchApp.fetch(materialLinkUrl, { method: "post", muteHttpExceptions: true }).getResponseCode();
    // 401 aqui é o esperado (chamada sem o segredo): a conexão com o Supabase funciona.
    console.log("Supabase (material-link) respondeu:", status);
  }
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
