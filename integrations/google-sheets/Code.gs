/**
 * Recebe os formulários do site da Vispe Capital e grava numa planilha Google,
 * uma aba por formulário (o site envia de lib/forms/submit.ts).
 *
 * Instalação (uma vez):
 *  1. Crie a planilha. As abas "diagnostico", "franquia", "materiais" e
 *     "carreiras" são criadas sozinhas, com cabeçalho, no primeiro envio.
 *  2. Extensões → Apps Script → cole este arquivo inteiro em Code.gs.
 *  3. Para os currículos: crie uma pasta no Drive (só a Vispe com acesso) e
 *     cole o ID dela (o trecho da URL depois de /folders/) em RESUME_FOLDER_ID.
 *  4. Implantar → Nova implantação → Tipo: App da Web.
 *       Executar como: Eu · Quem pode acessar: Qualquer pessoa.
 *     Autorize o acesso pedido (planilha, Drive e e-mail).
 *  5. Copie a URL do App da Web (termina em /exec) para NEXT_PUBLIC_FORMS_ENDPOINT
 *     no .env.local e gere o build do site de novo.
 * Mudou este código? Implantar → Gerenciar implantações → editar → Nova versão
 * (a URL continua a mesma).
 */

/** ID da pasta do Drive onde os currículos em PDF são salvos. */
const RESUME_FOLDER_ID = "1MosWWTHX7vJPmOYfZ-e3dzOM9VxjWKH0";

/**
 * Opcional: link de cada material gratuito (slug → URL do arquivo no Drive, com
 * acesso "qualquer pessoa com o link"). Com o link, quem preenche recebe o
 * material por e-mail na hora; sem ele, só a linha na planilha.
 */
const MATERIAL_LINKS = {
  // "checklist-reforma-tributaria": "https://drive.google.com/file/d/.../view",
};

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

const MAX_FIELD = 2000;
const MAX_RESUME_BYTES = 4 * 1024 * 1024;

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const columns = SHEETS[body.sheet];
    if (!columns) return json({ ok: false, error: "formulário desconhecido" });
    const values = body.values || {};
    if (values.consent !== "on") return json({ ok: false, error: "sem consentimento" });

    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const sheet = sheetFor(body.sheet, columns);
      const extra = [];
      if (body.sheet === "carreiras") extra.push(saveResume(body.file, values.name));
      sheet.appendRow([
        new Date(),
        ...columns.map(([key]) => clean(values[key])),
        ...extra,
        clean(values.locale),
        clean(body.page),
      ]);
    } finally {
      lock.releaseLock();
    }

    if (body.sheet === "materiais") sendMaterial(values);
    return json({ ok: true });
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: String(error) });
  }
}

/** Aba do formulário; cria com cabeçalho na primeira vez. */
function sheetFor(name, columns) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(name);
  if (!sheet) {
    sheet = book.insertSheet(name);
    const header = ["Recebido em", ...columns.map(([, title]) => title)];
    if (name === "carreiras") header.push("Currículo");
    header.push("Idioma", "Página");
    sheet.appendRow(header);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, header.length).setFontWeight("bold");
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
  if (!file || !file.base64 || !RESUME_FOLDER_ID) return "";
  const bytes = Utilities.base64Decode(file.base64);
  if (bytes.length > MAX_RESUME_BYTES) throw new Error("currículo acima de 4 MB");
  // Assinatura de PDF (%PDF-), não só a extensão.
  if (String.fromCharCode.apply(null, bytes.slice(0, 5).map((b) => (b + 256) % 256)) !== "%PDF-") {
    throw new Error("currículo não é PDF");
  }
  const stamp = Utilities.formatDate(new Date(), "America/Sao_Paulo", "yyyy-MM-dd HHmm");
  const safeName = String(name || "candidato").replace(/[^\p{L}\p{N} -]/gu, "").slice(0, 60);
  const blob = Utilities.newBlob(bytes, "application/pdf", `${stamp} - ${safeName}.pdf`);
  return DriveApp.getFolderById(RESUME_FOLDER_ID).createFile(blob).getUrl();
}

/** Envia o link do material por e-mail, se configurado em MATERIAL_LINKS. */
function sendMaterial(values) {
  const link = MATERIAL_LINKS[values.material];
  if (!link || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email || "")) return;
  MailApp.sendEmail({
    to: values.email,
    subject: "Seu material gratuito da Vispe Capital",
    htmlBody:
      `<p>Olá, ${clean(values.name).replace(/[<>&]/g, "")}!</p>` +
      `<p>Obrigado pelo interesse. Seu material está aqui: <a href="${link}">baixar o material</a>.</p>` +
      "<p>Equipe Vispe Capital</p>",
    name: "Vispe Capital",
  });
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
