"use client";

import { useSyncExternalStore } from "react";

// Valor fixo no servidor/hidratação; o horário real entra só após o mount.
const SERVER_TIME = "12:34";

function subscribe(onChange: () => void) {
  const interval = setInterval(onChange, 15_000);
  return () => clearInterval(interval);
}

function getTime() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function LiveClock() {
  const time = useSyncExternalStore(subscribe, getTime, () => SERVER_TIME);
  return <>{time}</>;
}
