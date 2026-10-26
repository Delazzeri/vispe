/**
 * Recebe os formulários do site da Vispe Capital e grava numa planilha Google,
 * uma aba por formulário (o site envia de lib/forms/submit.ts). No formulário
 * de material gratuito, também envia por e-mail um link de download que expira
 * (gerado pela Edge Function material-link do Supabase).
 *
 * Instalação (uma vez):
 *  1. Crie a planilha. As abas "diagnostico", "franquia", "materiais" e
 *     "carreiras" são criadas sozinhas, com cabeçalho, no primeiro envio; cada
 *     landing page ganha a aba "lp-<endereço>" no primeiro envio dela.
 *  2. Extensões → Apps Script → cole este arquivo inteiro em Code.gs.
 *  3. Configurações do projeto (engrenagem) → Propriedades do script → adicione:
 *       RESUME_FOLDER_ID      ID da pasta do Drive dos currículos (trecho da URL
 *                             depois de /folders/; só a Vispe com acesso)
 *       MATERIAL_LINK_URL     https://<projeto>.supabase.co/functions/v1/material-link
 *       MATERIAL_LINK_SECRET  o mesmo segredo cadastrado na função, no Supabase
 *     Sem as duas últimas, o material só é registrado na planilha (sem e-mail).
 *     Opcional, Conversions API da Meta (leads também pelo servidor):
 *       META_PIXEL_ID         o mesmo ID do Pixel do site (NEXT_PUBLIC_META_PIXEL_ID)
 *       META_CAPI_TOKEN       token gerado em Gerenciador de Eventos → Pixel →
 *                             Configurações → API de Conversões → Gerar token
 *       META_TEST_EVENT_CODE  só para testar (código "TEST…" da aba Testar eventos);
 *                             apague depois
 *       META_GRAPH_VERSION    versão da Graph API (padrão v23.0)
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
    metaPixelId: props.getProperty("META_PIXEL_ID") || "",
    metaCapiToken: props.getProperty("META_CAPI_TOKEN") || "",
    metaTestEventCode: props.getProperty("META_TEST_EVENT_CODE") || "",
    metaGraphVersion: props.getProperty("META_GRAPH_VERSION") || "v23.0",
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

/**
 * Colunas acrescentadas depois que a aba já existia: entram no fim (depois de
 * Idioma/Página e das colunas do material), para as linhas antigas não desalinharem.
 */
const TRAILING = {
  diagnostico: [["services", "Serviços"]],
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
    // Landing pages: cada LP grava na própria aba, com as colunas que ela manda.
    if (body.sheet === "lp") {
      const result = saveLanding(body);
      if (result.ok) sendMetaConversion(body);
      return json(result);
    }
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
        ...(TRAILING[body.sheet] || []).map(([key]) => clean(values[key])),
      ]);
    } finally {
      lock.releaseLock();
    }

    sendMetaConversion(body);
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
  header.push(...(TRAILING[name] || []).map(([, title]) => title));
  const current = sheet.getLastColumn() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
  if (current.join("|") !== header.join("|")) {
    sheet.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ─────────────────────────────────────────────────────────────
// Landing pages (/lp/<slug>/): aba "lp-<slug>" criada no primeiro envio. Cada
// coluna guarda na nota do cabeçalho o id do campo ("campo:email"), então
// renomear um campo no admin só troca o título e campo novo entra no fim —
// as linhas antigas nunca desalinham.
// ─────────────────────────────────────────────────────────────

const LP_MAX_COLUMNS = 30;
/** Colunas fixas de toda LP: [id, título]. */
const LP_FIXED_START = [["_recebido", "Recebido em"]];
const LP_FIXED_END = [
  ["utm_source", "UTM source"],
  ["utm_medium", "UTM medium"],
  ["utm_campaign", "UTM campaign"],
  ["utm_content", "UTM content"],
  ["utm_term", "UTM term"],
  ["locale", "Idioma"],
  ["_pagina", "Página"],
];

function saveLanding(body) {
  const values = body.values || {};
  const lp = body.lp || {};
  if (values.consent !== "on") return { ok: false, error: "sem consentimento" };
  if (typeof lp.slug !== "string" || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(lp.slug) || lp.slug.length > 80) {
    return { ok: false, error: "landing page inválida" };
  }
  const fields = (Array.isArray(body.columns) ? body.columns : [])
    .filter((column) => Array.isArray(column) && /^[a-z0-9_]{1,40}$/i.test(String(column[0])))
    .slice(0, LP_MAX_COLUMNS)
    .map((column) => [String(column[0]), String(column[1] || column[0]).slice(0, 100)]);
  if (!fields.length) return { ok: false, error: "sem campos" };

  const columns = [...LP_FIXED_START, ...fields, ...LP_FIXED_END];
  const row = Object.assign({}, values, { _recebido: new Date(), _pagina: body.page });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = landingSheetFor(lp.slug, columns);
    const positions = landingColumnPositions(sheet);
    const line = new Array(sheet.getLastColumn()).fill("");
    for (const [id] of columns) {
      const index = positions[id];
      if (index !== undefined) line[index] = id === "_recebido" ? row[id] : clean(row[id]);
    }
    sheet.appendRow(line);
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

/** id do campo → índice da coluna (lido das notas do cabeçalho). */
function landingColumnPositions(sheet) {
  const last = sheet.getLastColumn();
  const positions = {};
  if (!last) return positions;
  sheet.getRange(1, 1, 1, last).getNotes()[0].forEach((note, index) => {
    const match = String(note).match(/^campo:(.+)$/);
    if (match) positions[match[1]] = index;
  });
  return positions;
}

/** Aba da LP com todas as colunas: as que faltam entram no fim; títulos acompanham o admin. */
function landingSheetFor(slug, columns) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const name = ("lp-" + slug).slice(0, 99);
  const sheet = book.getSheetByName(name) || book.insertSheet(name);
  const positions = landingColumnPositions(sheet);
  let next = sheet.getLastColumn();
  for (const [id, title] of columns) {
    let index = positions[id];
    if (index === undefined) {
      index = next++;
      positions[id] = index;
      sheet.getRange(1, index + 1).setNote("campo:" + id);
    }
    const cell = sheet.getRange(1, index + 1);
    if (cell.getValue() !== title) cell.setValue(title);
  }
  sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight("bold");
  sheet.setFrozenRows(1);
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

// ─────────────────────────────────────────────────────────────
// Conversions API da Meta: o lead também vai pelo servidor, com e-mail, telefone
// e nome criptografados (SHA-256), para a Meta achar a conta da pessoa mesmo com
// bloqueador ou no iPhone. O site só manda `tracking` quando a pessoa aceitou os
// cookies de marketing; o event_id é o mesmo do Pixel, então a Meta conta uma vez.
// Falha aqui nunca derruba o formulário (a linha já foi gravada).

const META_EVENTS = { Lead: true, CompleteRegistration: true };

function sendMetaConversion(body) {
  const tracking = body.tracking;
  const { metaPixelId, metaCapiToken, metaTestEventCode, metaGraphVersion } = config();
  if (!tracking || !metaPixelId || !metaCapiToken) return;
  if (!META_EVENTS[tracking.eventName] || typeof tracking.eventId !== "string") return;
  try {
    const user = tracking.user || {};
    const userData = { client_user_agent: String(tracking.userAgent || "").slice(0, 500) };
    const email = String(user.email || "").trim().toLowerCase();
    if (email) userData.em = [sha256(email)];
    const phone = normalizePhone(user.phone);
    if (phone) userData.ph = [sha256(phone)];
    const names = String(user.name || "").trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (names.length) userData.fn = [sha256(names[0])];
    if (names.length > 1) userData.ln = [sha256(names[names.length - 1])];
    if (tracking.fbp) userData.fbp = String(tracking.fbp).slice(0, 200);
    if (tracking.fbc) userData.fbc = String(tracking.fbc).slice(0, 500);

    const event = {
      event_name: tracking.eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: tracking.eventId.slice(0, 100),
      event_source_url: String(body.page || "").slice(0, 1000),
      action_source: "website",
      user_data: userData,
    };
    if (tracking.contentName) event.custom_data = { content_name: String(tracking.contentName).slice(0, 200) };
    const payload = { data: [event] };
    if (metaTestEventCode) payload.test_event_code = metaTestEventCode;

    const url = "https://graph.facebook.com/" + metaGraphVersion + "/" + encodeURIComponent(metaPixelId) + "/events?access_token=" + encodeURIComponent(metaCapiToken);
    const response = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    });
    if (response.getResponseCode() >= 300) {
      console.error("Meta CAPI respondeu", response.getResponseCode(), response.getContentText().slice(0, 500));
    }
  } catch (error) {
    console.error("Meta CAPI", error);
  }
}

/** Telefone só com dígitos e o DDI do Brasil (55) quando vier sem. */
function normalizePhone(value) {
  let digits = String(value || "").replace(/\D/g, "").replace(/^0+/, "");
  if (digits.length === 10 || digits.length === 11) digits = "55" + digits;
  return digits.length >= 8 ? digits : "";
}

function sha256(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8)
    .map((byte) => ((byte + 256) % 256).toString(16).padStart(2, "0"))
    .join("");
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
