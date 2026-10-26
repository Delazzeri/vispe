/** Link de convite de grupo do WhatsApp (o único destino aceito no "Ir para o grupo do WhatsApp"). */
export function isWhatsappGroupLink(value: string): boolean {
  return /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+\/?(\?.*)?$/.test(value.trim());
}
