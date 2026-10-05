import type { MetadataRoute } from "next";
import { blogPosts } from "@/content/blog";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: new URL("/sobre", site.url).toString(), changeFrequency: "monthly", priority: 0.6 },
    { url: new URL("/contato", site.url).toString(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: new URL(`/blog/${post.slug}`, site.url).toString(),
    lastModified: post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const productRoutes: MetadataRoute.Sitemap = site.services.map((service) => ({
    url: new URL(`/produtos/${service.slug}`, site.url).toString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes, ...productRoutes];
}
