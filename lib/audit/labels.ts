// Nomes em português para o registro de atividades (admin_audit_log, 0013).
// Coluna sem nome aqui aparece como está no banco.

import type { AuditAction } from "@/lib/supabase/types";

export const auditActionLabel: Record<AuditAction, string> = {
  insert: "Criou",
  update: "Editou",
  delete: "Excluiu",
};

export const auditEntities = {
  articles: { label: "Artigo", editor: "/admin/editor/?id=" },
  materials: { label: "Material", editor: "/admin/materiais/editor/?id=" },
  material_formats: { label: "Formato de material", editor: null },
  landing_pages: { label: "Landing page", editor: "/admin/landing-pages/editor/?id=" },
  popups: { label: "Pop-up", editor: "/admin/popups/editor/?id=" },
  profiles: { label: "Acesso ao admin", editor: null },
} as const satisfies Record<string, { label: string; editor: string | null }>;

export type AuditEntity = keyof typeof auditEntities;

export function isAuditEntity(value: string): value is AuditEntity {
  return value in auditEntities;
}

const fieldLabels: Record<string, string> = {
  title: "título",
  name: "nome",
  name_en: "nome em inglês",
  slug: "endereço (slug)",
  excerpt: "resumo",
  content_md: "texto",
  content_json: "texto (editor)",
  cover_image_url: "capa",
  cover_image_alt: "texto alternativo da capa",
  category: "categoria",
  author: "autor",
  meta_title: "título no Google",
  meta_description: "descrição no Google",
  status: "status",
  published_at: "data de publicação",
  tags: "tags",
  faq: "FAQ",
  en: "tradução em inglês",
  type: "tipo",
  format: "formato",
  tagline: "chamada",
  headline: "título da página",
  description_md: "descrição",
  description_json: "descrição (editor)",
  image_url: "imagem",
  image_alt: "texto alternativo da imagem",
  image_width: "largura da imagem",
  image_height: "altura da imagem",
  file_path: "arquivo",
  file_name: "nome do arquivo",
  file_size: "tamanho do arquivo",
  sort_order: "ordem",
  template: "modelo",
  sections: "seções",
  og_image_url: "imagem de compartilhamento",
  noindex: "esconder do Google",
  whatsapp_message: "mensagem do WhatsApp",
  active: "ligado/pausado",
  starts_at: "início",
  ends_at: "fim",
  priority: "prioridade",
  layout: "formato",
  body: "texto",
  cta_label: "texto do botão",
  cta_url: "link",
  cta_new_tab: "abrir em nova aba",
  locale: "idioma",
  page_rule: "páginas",
  page_paths: "lista de páginas",
  devices: "aparelhos",
  trigger_type: "quando aparece",
  trigger_value: "tempo/rolagem",
  max_views: "máximo de exibições",
  cooldown_hours: "intervalo entre exibições",
  hide_after_click: "esconder depois do clique",
  full_name: "nome",
  role: "papel",
};

// Cópias internas do editor de texto: mudam sempre junto com o Markdown.
const hiddenFields = new Set(["content_json", "description_json"]);

/** Nomes dos campos que mudaram, para a coluna "Detalhes". */
export function auditChangedLabels(fields: string[]): string[] {
  return fields.filter((field) => !hiddenFields.has(field)).map((field) => fieldLabels[field] ?? field);
}
