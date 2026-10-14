import { Inter } from "next/font/google";
import localFont from "next/font/local";

// Fontes do site (layouts do site, do admin e a página 404 global).

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const interDisplay = localFont({
  variable: "--font-inter-display",
  display: "swap",
  src: [
    {
      path: "../public/fonts/inter-display/InterDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/inter-display/InterDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/inter-display/InterDisplay-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/inter-display/InterDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});


/** Classes com as variáveis --font-inter e --font-inter-display, para o <html>. */
export const fontVariables = `${inter.variable} ${interDisplay.variable}`;
