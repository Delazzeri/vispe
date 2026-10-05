import { Play } from "lucide-react";
import { useSite } from "@/content/site";

type VideoPlaceholderProps = {
  title: string;
  className?: string;
};

/**
 * Placeholder de vídeo (YouTube/Vimeo pendente — ver TODO(content) no
 * content/site.ts). Estrutura final: poster local + <iframe> lazy-loaded
 * no clique, igual ao padrão de docs/reference-analysis.md (VideoEmbed).
 */
export function VideoPlaceholder({ title, className }: VideoPlaceholderProps) {
  const { ui } = useSite();
  return (
    <div
      className={`relative flex aspect-video items-center justify-center overflow-hidden rounded-3xl bg-ink ${className ?? ""}`}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper/10">
          <Play className="h-6 w-6 translate-x-0.5 text-paper" aria-hidden fill="currentColor" />
        </span>
        <p className="max-w-xs text-sm font-medium text-paper/60">{title}</p>
        <p className="text-xs text-paper/40">{ui.videoPlaceholder}</p>
      </div>
    </div>
  );
}
