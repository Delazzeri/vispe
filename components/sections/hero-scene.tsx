"use client";

import { useReducedMotion } from "motion/react";

export function HeroScene() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="absolute inset-x-0 top-[280px] -z-10 h-[420px] overflow-hidden md:top-[360px] md:h-[620px]"
    >
      {shouldReduceMotion ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/media/hero/scene2-poster-1600.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <video
          ref={(el) => {
            if (el) el.playbackRate = 0.5;
          }}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/media/hero/scene2-poster-1600.jpg"
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          preload="auto"
        >
          <source src="/media/hero/scene2-mobile.mp4" media="(max-width: 809px)" type="video/mp4" />
          <source src="/media/hero/scene2.mp4" type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-bg to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
