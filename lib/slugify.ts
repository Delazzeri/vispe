/** Texto → slug de URL: minúsculas, sem acentos, palavras separadas por hífen. */
export function slugify(text: string, max = 90): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max)
    .replace(/-+$/, "");
}
