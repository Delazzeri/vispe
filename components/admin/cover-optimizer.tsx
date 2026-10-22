"use client";

import { useState } from "react";
import { optimizeImage } from "@/lib/admin/optimize-image";
import { getSupabase } from "@/lib/supabase/client";
import { adminSecondary } from "./admin-shell";

// Otimiza de uma vez as imagens dos materiais enviadas antes da compressão no
// upload (lib/admin/optimize-image.ts): baixa cada JPG/PNG do bucket público,
// converte para WebP até 1600px, sobe como arquivo novo e troca o link na linha.
// Os arquivos antigos ficam no Storage: as páginas já geradas apontam para eles
// até o próximo build.

const bucket = "material-images";
const fields = ["cover_image_url", "image_url"] as const;

type Progress = { done: number; total: number; savedKb: number; failed: string[] };

export function CoverOptimizer() {
  const [progress, setProgress] = useState<Progress>();
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState<string>();

  async function run() {
    const supabase = getSupabase();
    if (!supabase) return;
    setRunning(true);
    setMessage(undefined);
    const { data, error } = await supabase.from("materials").select("id,slug,cover_image_url,image_url");
    if (error || !data) {
      setRunning(false);
      return setMessage(`Não foi possível ler os materiais: ${error?.message ?? "resposta vazia"}`);
    }
    const marker = `/object/public/${bucket}/`;
    const jobs = data.flatMap((row) =>
      fields.flatMap((field) => {
        const url = row[field];
        return url && url.includes(marker) && !/\.webp(\?|$)/i.test(url) ? [{ row, field, url }] : [];
      }),
    );
    if (!jobs.length) {
      setRunning(false);
      return setMessage("Todas as imagens já estão otimizadas.");
    }

    const state: Progress = { done: 0, total: jobs.length, savedKb: 0, failed: [] };
    setProgress({ ...state });
    for (const { row, field, url } of jobs) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`download ${response.status}`);
        const source = await response.blob();
        const image = await optimizeImage(source);
        if (image.extension === "webp") {
          const folder = field === "cover_image_url" ? "covers" : "images";
          const path = `${folder}/${row.slug}-${crypto.randomUUID().slice(0, 8)}.webp`;
          const upload = await supabase.storage
            .from(bucket)
            .upload(path, image.blob, { cacheControl: "31536000", contentType: image.contentType });
          if (upload.error) throw upload.error;
          const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
          const changes = field === "cover_image_url" ? { cover_image_url: publicUrl } : { image_url: publicUrl };
          const update = await supabase.from("materials").update(changes).eq("id", row.id);
          if (update.error) throw update.error;
          state.savedKb += Math.round((source.size - image.blob.size) / 1024);
        }
      } catch (problem) {
        state.failed.push(`${row.slug}: ${problem instanceof Error ? problem.message : String(problem)}`);
      }
      state.done += 1;
      setProgress({ ...state });
    }
    setRunning(false);
  }

  return (
    <div className="text-sm">
      <button type="button" onClick={run} disabled={running} className={adminSecondary}>
        {running ? "Otimizando…" : "Otimizar capas"}
      </button>
      <div aria-live="polite" className="mt-2 text-fg-muted">
        {progress && (
          <p>
            {progress.done} de {progress.total} imagens · {Math.round(progress.savedKb / 1024 * 10) / 10} MB a menos
            {!running && progress.done === progress.total && " · pronto. Gere o build de novo para o site usar as novas."}
          </p>
        )}
        {progress?.failed.map((line) => (
          <p key={line} className="font-medium text-brand-dark">
            {line}
          </p>
        ))}
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
