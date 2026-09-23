export const spring = {
  snappy: { type: "spring", stiffness: 400, damping: 30 }, // hover, botões
  smooth: { type: "spring", stiffness: 200, damping: 26 }, // cards, reveals
  gentle: { type: "spring", stiffness: 120, damping: 20 }, // hero, grandes blocos
} as const;

export const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: spring.smooth,
} as const;

export const stagger = 0.06; // segundos entre filhos
