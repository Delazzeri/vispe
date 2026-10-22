// Comprime imagens no navegador antes de subir para o Storage (capas de
// artigos e materiais): redimensiona até `maxWidth` e converte para WebP. Uma
// capa de 1MB em JPG vira ~100–200KB, o que pesa direto no LCP das páginas.
// Se o resultado sair maior que o original (imagem já otimizada), fica o original.

export type OptimizedImage = { blob: Blob; extension: string; contentType: string };

export async function optimizeImage(source: Blob, maxWidth = 1600, quality = 0.82): Promise<OptimizedImage> {
  const original = {
    blob: source,
    contentType: source.type,
    extension: source.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg",
  };
  try {
    const bitmap = await createImageBitmap(source);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return original;
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
    // Navegador sem encoder WebP devolve PNG (ou null): nesse caso, fica o original.
    if (!blob || blob.type !== "image/webp" || blob.size >= source.size) return original;
    return { blob, contentType: "image/webp", extension: "webp" };
  } catch {
    return original;
  }
}
