"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { stagger } from "@/components/motion/presets";
import { Reveal } from "@/components/motion/reveal";
import { VideoPlaceholder } from "@/components/ui/video-placeholder";
import { FeaturedTestimonial } from "@/components/ui/featured-testimonial";
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
  const { title, description, chips, video } = site.featureChips;

  return (
    <section
      id={id}
      aria-labelledby="feature-chips-heading"
      className="bg-bg pb-8 pt-6 md:pt-8"
    >
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
                className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-fg shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]"
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
                className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-fg shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]"
              >
                {label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>

      <Reveal delay={0.15} className="mx-auto mt-14 max-w-[1104px] px-6">
        <VideoPlaceholder title={video.title} />
      </Reveal>

      <Reveal delay={0.2} className="mx-auto mt-8 max-w-xl px-6">
        <FeaturedTestimonial {...site.featuredTestimonial} />
      </Reveal>
    </section>
  );
}
