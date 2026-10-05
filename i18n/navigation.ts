import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Usado pelo seletor de idioma para trocar de locale mantendo a página atual.
export const { usePathname, useRouter } = createNavigation(routing);
