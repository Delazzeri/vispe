// Regras comuns de validação dos formulários (rodam no navegador).

export function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** Telefone com DDD: ao menos 10 dígitos. */
export const isPhone = (value: string) => value.replace(/\D/g, "").length >= 10;
