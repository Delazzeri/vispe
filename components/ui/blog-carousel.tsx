"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { BlogCard } from "@/components/ui/blog-card";
import { cn } from "@/lib/cn";
import type { BlogPost } from "@/content/blog";
import { useSite } from "@/content/site";
import { format } from "@/content/types";

type BlogCarouselProps = {
  posts: readonly BlogPost[];
};

const GAP_PX = 24; // gap-6
const DESKTOP_QUERY = "(min-width: 768px)";

export function BlogCarousel({ posts }: BlogCarouselProps) {
  const { ui } = useSite();
  const shouldReduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLUListElement>(null);
  // 3 por vez no desktop, 1 no mobile. O servidor renderiza a versão desktop.
  const [perView, setPerView] = useState(3);
  const [activePage, setActivePage] = useState(0);
  // Categoria filtrada (null = todas), na ordem em que aparecem nos posts.
  const [category, setCategory] = useState<string | null>(null);
  const categories = [...new Set(posts.map((post) => post.category))];
  const visible = category ? posts.filter((post) => post.category === category) : posts;

  const pageCount = Math.ceil(visible.length / perView);
  // Espaçadores completam a última página para ela poder ser alinhada ao início.
  const spacerCount = pageCount * perView - visible.length;

  function selectCategory(next: string | null) {
    setCategory(next);
    setActivePage(0);
    scrollerRef.current?.scrollTo({ left: 0 });
  }

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

  const chipClass = (active: boolean) =>
    cn(
      "rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
      active ? "bg-ink text-paper" : "bg-surface text-fg-muted shadow-xs hover:text-ink",
    );

  return (
    <div>
      {categories.length > 1 && (
        <div role="group" aria-label={ui.blogCategories} className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            aria-pressed={category === null}
            onClick={() => selectCategory(null)}
            className={chipClass(category === null)}
          >
            {ui.blogAllCategories}
          </button>
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              lang="pt-BR"
              aria-pressed={category === name}
              onClick={() => selectCategory(name)}
              className={chipClass(category === name)}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <ul
        ref={scrollerRef}
        aria-label={ui.blogPosts}
        onScroll={handleScroll}
        className="-my-4 flex snap-x snap-mandatory gap-6 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ ["--per-view" as string]: perView }}
      >
        {visible.map((post, index) => (
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
        <div className="mt-8 flex justify-center gap-2" role="group" aria-label={ui.blogPages}>
          {Array.from({ length: pageCount }, (_, page) => (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              aria-label={format(ui.blogGoToPage, { page: page + 1, total: pageCount })}
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
