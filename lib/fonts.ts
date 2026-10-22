import { Inter } from "next/font/google";
import localFont from "next/font/local";

// Fontes do site (layouts do site, do admin e a página 404 global).

// Inter é só reserva (a Inter Display cobre os pesos e caracteres do site):
// sem preload, o navegador só baixa se algum caractere faltar.
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// Arquivos recortados para o alfabeto latino + pontuação/setas usadas no site
// (~33KB cada, antes ~111KB). Originais completos em originais/fonts/; recorte
// com pyftsubset (fonttools), ver docs/design-system.md.
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
