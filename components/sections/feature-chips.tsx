"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { stagger } from "@/components/motion/presets";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content/site";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: stagger } },
};

const chip: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export function FeatureChips({ id }: { id?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const { title, description, chips } = site.featureChips;

  return (
    <section id={id} aria-labelledby="feature-chips-heading" className="bg-bg pb-24 pt-6 md:pb-32 md:pt-8">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal delay={0.05}>
          <h2
            id="feature-chips-heading"
            className="mt-3 text-balance text-3xl font-bold tracking-tight text-fg md:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            {title}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-5 text-balance text-lg text-fg-muted">{description}</p>
        </Reveal>

        {shouldReduceMotion ? (
          <ul aria-label="Soluções oferecidas" className="mt-10 flex flex-wrap justify-center gap-2">
            {chips.map((label) => (
              <li
                key={label}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-fg"
              >
                {label}
              </li>
            ))}
          </ul>
        ) : (
          <motion.ul
            aria-label="Soluções oferecidas"
            className="mt-10 flex flex-wrap justify-center gap-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={container}
          >
            {chips.map((label) => (
              <motion.li
                key={label}
                variants={chip}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-fg"
              >
                {label}
              </motion.li>
            ))}
          </motion.ul>
        )}

        {/* TODO(content): vídeo overview (lazy, com poster) + depoimento em
            destaque — pendente de material institucional real. Ver
            docs/reference-analysis.md item 4 (VideoEmbed + Quote). */}
      </div>
    </section>
  );
}
