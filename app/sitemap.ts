import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { categories, getProducts } from "@/lib/catalog";
import { getPosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([getProducts(), getPosts()]);
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticPages = [
    "",
    "/tienda",
    "/quienes-somos",
    "/blog",
    "/politicas-devolucion",
    "/privacidad",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const productPages = products.map((p) => ({
    url: `${base}/producto/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages = categories.map((c) => ({
    url: `${base}/categoria/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const postPages = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...postPages];
}
