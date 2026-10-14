import type { MetadataRoute } from "next";
import { brand } from "@/content/brand";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // /admin/ é o painel do blog (também marcado noindex).
    rules: { userAgent: "*", allow: "/", disallow: "/admin/" },
    sitemap: new URL("/sitemap.xml", brand.url).toString(),
  };
}
