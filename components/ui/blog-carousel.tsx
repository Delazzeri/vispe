"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { BlogCard } from "@/components/ui/blog-card";
import { cn } from "@/lib/cn";
import type { BlogPost } from "@/content/blog";

type BlogCarouselProps = {
  posts: readonly BlogPost[];
};

const GAP_PX = 24; // gap-6
const DESKTOP_QUERY = "(min-width: 768px)";

export function BlogCarousel({ posts }: BlogCarouselProps) {
  const shouldReduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLUListElement>(null);
  // 3 por vez no desktop, 1 no mobile. O servidor renderiza a versão desktop.
  const [perView, setPerView] = useState(3);
  const [activePage, setActivePage] = useState(0);

  const pageCount = Math.ceil(posts.length / perView);
  // Espaçadores completam a última página para ela poder ser alinhada ao início.
  const spacerCount = pageCount * perView - posts.length;

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const update = () => setPerView(media.matches ? 3 : 1);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const handleScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const step = scroller.clientWidth + GAP_PX;
    setActivePage(Math.min(pageCount - 1, Math.max(0, Math.round(scroller.scrollLeft / step))));
  }, [pageCount]);

  function goToPage(page: number) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({
      left: page * (scroller.clientWidth + GAP_PX),
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <div>
      <ul
        ref={scrollerRef}
        aria-label="Artigos do blog"
        onScroll={handleScroll}
        className="-my-4 flex snap-x snap-mandatory gap-6 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ ["--per-view" as string]: perView }}
      >
        {posts.map((post, index) => (
          <li
            key={post.slug}
            className={cn(
              "w-[calc((100%-(var(--per-view)-1)*1.5rem)/var(--per-view))] shrink-0",
              index % perView === 0 && "snap-start",
            )}
          >
            <BlogCard post={post} />
          </li>
        ))}
        {Array.from({ length: spacerCount }, (_, index) => (
          <li
            key={`spacer-${index}`}
            aria-hidden
            className="w-[calc((100%-(var(--per-view)-1)*1.5rem)/var(--per-view))] shrink-0"
          />
        ))}
      </ul>

      {pageCount > 1 && (
        <div className="mt-8 flex justify-center gap-2" role="group" aria-label="Páginas do blog">
          {Array.from({ length: pageCount }, (_, page) => (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              aria-label={`Ir para o grupo ${page + 1} de ${pageCount}`}
              aria-current={page === activePage ? "true" : undefined}
              className={cn(
                "h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                page === activePage ? "w-6 bg-ink" : "w-2 bg-fg-muted/30 hover:bg-fg-muted/60",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
