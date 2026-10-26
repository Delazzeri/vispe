"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useSite } from "@/content/site";
import { format } from "@/content/types";
import { cn } from "@/lib/cn";

// Só o pedaço da IFrame Player API do YouTube que usamos.
type YouTubePlayer = {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  mute(): void;
  unMute(): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  getIframe(): HTMLIFrameElement;
  destroy(): void;
};

type YouTubeApi = {
  Player: new (
    element: HTMLElement,
    options: {
      host: string;
      videoId: string;
      width: string;
      height: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: (event: { target: YouTubePlayer }) => void;
        onStateChange: (event: { data: number; target: YouTubePlayer }) => void;
      };
    },
  ) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// Estados do player (YT.PlayerState).
const ENDED = 0;
const PLAYING = 1;
const PAUSED = 2;
const BUFFERING = 3;

// Ao começar a tocar, o YouTube mostra um ícone de pausa no centro por alguns
// segundos (controls=0 não tira); o nosso fica por cima até ele sumir.
const YOUTUBE_ICON_MS = 4200;

let apiPromise: Promise<YouTubeApi> | undefined;

/** Carrega a API do YouTube uma vez, só quando alguém dá play. */
function loadYouTubeApi(): Promise<YouTubeApi> {
  apiPromise ??= new Promise<YouTubeApi>((resolve, reject) => {
    if (window.YT?.Player) return resolve(window.YT);
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      apiPromise = undefined;
      reject(new Error("YouTube API indisponível"));
    };
    document.head.append(script);
  });
  return apiPromise;
}

type Phase = "idle" | "loading" | "playing" | "paused" | "ended";

type VideoEmbedProps = {
  youtubeId: string;
  title: string;
  /** Capa local com largura no nome (ex.: "/media/video/x-1280.webp"). */
  poster: string;
  className?: string;
};

/**
 * Vídeo do YouTube (não listado) com cara de vídeo do próprio site: capa local
 * até o clique, player carregado só então e controles nossos (play/pausa,
 * andamento, som, tela cheia). O iframe fica mais alto que a moldura e sem
 * eventos de ponteiro, então título, logo e sugestões do YouTube ficam fora da
 * área visível; ao pausar, um véu desfocado cobre o quadro.
 */
export function VideoEmbed({ youtubeId, title, poster, className }: VideoEmbedProps) {
  const { ui } = useSite();
  const labels = ui.video;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [bezel, setBezel] = useState(false);
  const bezelTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Cria o player depois do primeiro clique.
  useEffect(() => {
    if (phase !== "loading" || playerRef.current) return;
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let fallback: ReturnType<typeof setTimeout> | undefined;
    loadYouTubeApi()
      .then((api) => {
        if (cancelled) return;
        // O YouTube troca o elemento pelo iframe: usa um filho criado aqui, não um nó do React.
        const target = document.createElement("div");
        host.replaceChildren(target);
        playerRef.current = new api.Player(target, {
          host: "https://www.youtube-nocookie.com",
          videoId: youtubeId,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            rel: 0,
            playsinline: 1,
            cc_load_policy: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: ({ target: player }) => {
              const iframe = player.getIframe();
              iframe.title = title;
              iframe.tabIndex = -1;
              // Começa pelo autoplay (playVideo aqui faz o YouTube mostrar o ícone de pausa).
              // Navegador que bloqueia som sem gesto no iframe (iOS): começa mudo.
              fallback = setTimeout(() => {
                const state = player.getPlayerState();
                if (state !== PLAYING && state !== BUFFERING) {
                  player.mute();
                  setMuted(true);
                  player.playVideo();
                }
              }, 1500);
            },
            onStateChange: ({ data }) => {
              if (data === PLAYING) {
                setPhase("playing");
                setBezel(true);
                clearTimeout(bezelTimer.current);
                bezelTimer.current = setTimeout(() => setBezel(false), YOUTUBE_ICON_MS);
              }
              else if (data === PAUSED) setPhase("paused");
              else if (data === ENDED) {
                setPhase("ended");
                setProgress(0);
              }
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) setPhase("idle");
      });
    return () => {
      cancelled = true;
      clearTimeout(fallback);
    };
  }, [phase, youtubeId, title]);

  // Desmontou: libera o player.
  useEffect(
    () => () => {
      clearTimeout(bezelTimer.current);
      playerRef.current?.destroy();
      playerRef.current = null;
    },
    [],
  );

  // Barra de andamento enquanto toca.
  useEffect(() => {
    if (phase !== "playing") return;
    const timer = setInterval(() => {
      const player = playerRef.current;
      const duration = player?.getDuration() ?? 0;
      if (player && duration > 0) setProgress(player.getCurrentTime() / duration);
    }, 250);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === wrapperRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function start() {
    const player = playerRef.current;
    if (!player) {
      setPhase("loading");
      return;
    }
    if (phase === "ended") player.seekTo(0, true);
    player.playVideo();
  }

  function toggle() {
    if (phase === "playing") playerRef.current?.pauseVideo();
    else start();
  }

  function toggleMute() {
    const player = playerRef.current;
    if (!player) return;
    if (muted) player.unMute();
    else player.mute();
    setMuted(!muted);
  }

  function seek(value: number) {
    const player = playerRef.current;
    const duration = player?.getDuration() ?? 0;
    if (!player || duration <= 0) return;
    player.seekTo(value * duration, true);
    setProgress(value);
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void wrapperRef.current?.requestFullscreen();
  }

  const active = phase === "playing" || phase === "paused";
  const showPoster = !active;
  const iconButton =
    "flex h-9 w-9 items-center justify-center rounded-full text-paper transition-colors hover:bg-paper/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "group relative overflow-hidden bg-ink",
        fullscreen ? "flex items-center justify-center" : "rounded-3xl",
        className,
      )}
    >
      <div className={cn("relative aspect-video w-full overflow-hidden", fullscreen && "w-[min(100vw,177.78vh)]")}>
        {phase !== "idle" && (
          // Iframe com o dobro da altura, centrado: o vídeo ocupa só a faixa visível.
          <div ref={hostRef} aria-hidden className="pointer-events-none absolute inset-x-0 -top-1/2 h-[200%] [&>iframe]:h-full [&>iframe]:w-full" />
        )}

        {active && (
          <button
            type="button"
            onClick={toggle}
            aria-label={phase === "playing" ? labels.pause : labels.resume}
            className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none"
          />
        )}

        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-1/2 left-1/2 z-10 flex h-18 w-18 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink/80 text-paper ring-1 ring-paper/20 backdrop-blur-sm transition-opacity duration-300",
            phase === "playing" && bezel ? "opacity-100" : "opacity-0",
          )}
        >
          <Pause className="h-6 w-6" aria-hidden fill="currentColor" />
        </span>

        {phase === "paused" && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-ink/45 backdrop-blur-md">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper/15 ring-1 ring-paper/25">
              <Play className="h-6 w-6 translate-x-0.5 text-paper" aria-hidden fill="currentColor" />
            </span>
          </div>
        )}

        {/* Capa: antes do play, carregando e no fim (esconde a tela final do YouTube). */}
        <button
          type="button"
          onClick={start}
          disabled={phase === "loading"}
          aria-label={format(labels.play, { title })}
          aria-hidden={!showPoster}
          tabIndex={showPoster ? 0 : -1}
          className={cn(
            "group/poster absolute inset-0 z-20 flex cursor-pointer items-center justify-center transition-opacity duration-500 focus-visible:outline-none",
            showPoster ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <Image src={poster} alt="" fill sizes="(min-width: 1152px) 1104px, 100vw" className="object-cover" />
          <span
            className={cn(
              "relative flex h-16 w-16 items-center justify-center rounded-full bg-brand text-brand-fg shadow-lg ring-4 ring-paper/20 transition-transform duration-200 group-hover:scale-105 md:h-20 md:w-20",
              phase === "loading" && "motion-safe:animate-pulse",
              "group-focus-visible/poster:ring-brand",
            )}
          >
            <Play className="h-7 w-7 translate-x-0.5 md:h-8 md:w-8" aria-hidden fill="currentColor" />
          </span>
        </button>

        {active && (
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 z-30 flex items-center gap-2 bg-linear-to-t from-ink/70 to-transparent px-3 pt-8 pb-3 transition-opacity duration-300 md:px-4",
              phase === "paused" ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-within:opacity-100",
            )}
          >
            <button type="button" onClick={toggle} aria-label={phase === "playing" ? labels.pause : labels.resume} className={iconButton}>
              {phase === "playing" ? (
                <Pause className="h-4 w-4" aria-hidden fill="currentColor" />
              ) : (
                <Play className="h-4 w-4 translate-x-px" aria-hidden fill="currentColor" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1000}
              step={1}
              value={Math.round(progress * 1000)}
              onChange={(event) => seek(Number(event.target.value) / 1000)}
              aria-label={labels.progress}
              className="h-1 min-w-0 flex-1 cursor-pointer accent-brand"
            />
            <button type="button" onClick={toggleMute} aria-label={muted ? labels.unmute : labels.mute} className={iconButton}>
              {muted ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
            </button>
            {document.fullscreenEnabled && (
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={fullscreen ? labels.exitFullscreen : labels.fullscreen}
                className={iconButton}
              >
                {fullscreen ? <Minimize className="h-4 w-4" aria-hidden /> : <Maximize className="h-4 w-4" aria-hidden />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
