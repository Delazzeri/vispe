import Image from "next/image";
import { cn } from "@/lib/cn";

type HeroRockProps = {
  side: "left" | "right";
  className?: string;
};

const sizes = "(max-width: 809px) 206px, 500px";

export function HeroRock({ side, className }: HeroRockProps) {
  const base = `/media/hero/rock-${side}-1000.webp`;
  const hover = `/media/hero/rock-${side}-hover-1000.webp`;

  return (
    <div className={cn("group relative", className)}>
      <Image
        src={base}
        alt=""
        width={1000}
        height={1453}
        sizes={sizes}
        className="w-full h-auto select-none"
        priority={false}
      />
      <Image
        src={hover}
        alt=""
        width={1000}
        height={1453}
        sizes={sizes}
        className="absolute inset-0 h-full w-full select-none opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-within:opacity-100"
      />
    </div>
  );
}
