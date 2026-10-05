import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const ogSize = { width: 1200, height: 630 } as const;

type OgImageInput = {
  title: string;
  eyebrow?: string;
};

// Cores espelham os tokens de globals.css (ImageResponse não lê CSS/Tailwind).
const colors = {
  bg: "#f2f2f2",
  fg: "#262626",
  fgMuted: "#595959",
  brand: "#d6b256",
  ink: "#000000",
} as const;

export function renderOgImage({ title, eyebrow }: OgImageInput) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: colors.bg,
          borderLeft: `16px solid ${colors.brand}`,
          color: colors.ink,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {eyebrow ? (
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: colors.fgMuted,
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3 }}>
            {title}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 34, fontWeight: 700 }}>{site.name}</div>
          <div style={{ fontSize: 24, color: colors.fg }}>{site.tagline}</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
