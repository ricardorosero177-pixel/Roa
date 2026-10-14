import { site } from "./site";
import type { Post, Product } from "./types";

const abs = (path: string) => new URL(path, site.url).toString();

/** Organización + tienda online. Le dice a Google que esto es un ecommerce. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "OnlineStore"],
    "@id": `${site.url}/#organization`,
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    logo: abs("/icon"),
    image: abs("/opengraph-image"),
    description: site.description,
    email: site.contact.email,
    telephone: `+${site.contact.whatsapp}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "La Florida",
      addressRegion: "Región Metropolitana",
      addressCountry: "CL",
    },
    sameAs: [site.contact.instagramUrl],
  };
}

/** WebSite con SearchAction (sitelinks searchbox en Google). */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: "es-CL",
    publisher: { "@id": `${site.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/tienda?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.image],
    description: product.description,
    sku: String(product.id),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      url: abs(`/producto/${product.slug}`),
      priceCurrency: site.currency,
      price: product.price,
      availability:
        (product.stock ?? 1) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${site.url}/#organization` },
    },
  };
}

export function blogPostingSchema(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [post.cover],
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category,
    author: { "@type": "Organization", name: site.legalName },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: abs(`/blog/${post.slug}`),
    inLanguage: "es-CL",
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.url),
    })),
  };
}

export function itemListSchema(products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(`/producto/${p.slug}`),
      name: p.name,
    })),
  };
}
