import type { Category, Product } from "./types";

const CDN =
  "https://d2uil25qo43m6t.cloudfront.net/t/w_800,h_800,q_auto,f_auto,c_fill,b_rgb:ffffff/shops/fotos";

export const categories: Category[] = [
  {
    slug: "hogar-y-decoracion",
    name: "Hogar & Decoración",
    description:
      "Floreros, esculturas y figuras de líneas simples para dar calma y carácter a tus espacios.",
  },
  {
    slug: "aromas-sensaciones",
    name: "Aromas & Sensaciones",
    description:
      "Aromas que despiertan emociones y transforman la energía de cada rincón. Muy pronto.",
  },
];

export const products: Product[] = [
  {
    id: 144044,
    slug: "florero-pequeno-minimalista-nordico",
    name: "Florero pequeño minimalista nórdico",
    price: 2990,
    image: `${CDN}/202601121504397357-d7881e31-793b-436f-88f7-c27a5beb7afc-md.jpg`,
    categorySlug: "hogar-y-decoracion",
    shortDescription: "Florero de líneas limpias, ideal para rincones serenos.",
    description:
      "Florero pequeño de inspiración nórdica, perfecto para una flor seca o un ramo minimalista. Su forma sobria aporta equilibrio a repisas, escritorios y mesas de centro.",
    featured: true,
    stock: 20,
  },
  {
    id: 144045,
    slug: "florero-grande-minimalista-nordico",
    name: "Florero grande minimalista nórdico",
    price: 3990,
    image: `${CDN}/202601121509086205-54419f5f-c6f8-4bd6-be4e-eddc94baf641-md.jpg`,
    categorySlug: "hogar-y-decoracion",
    shortDescription: "Presencia elegante para ramos y pampas.",
    description:
      "Florero grande de estilo nórdico que se vuelve protagonista de cualquier espacio. Perfecto para ramos de pampas o flores secas que aportan calidez y altura a la decoración.",
    featured: true,
    stock: 15,
  },
  {
    id: 144046,
    slug: "escultura-decorativa-ala-en-elevacion",
    name: "Escultura decorativa ala en elevación",
    price: 5990,
    image: `${CDN}/202601121510237397-55804908-30ca-45db-ae01-15717d498223-md.jpg`,
    categorySlug: "hogar-y-decoracion",
    shortDescription: "Una pieza escultórica que transmite movimiento.",
    description:
      "Escultura decorativa con forma de ala en elevación. Un objeto con intención que aporta un acento artístico y sofisticado a libreros, mesas y recibidores.",
    featured: true,
    stock: 10,
  },
  {
    id: 144047,
    slug: "escultura-decorativa-mariposa-corazon",
    name: "Escultura decorativa mariposa corazón",
    price: 4590,
    image: `${CDN}/202601121519016656-088cbd0c-6bac-434c-9550-f95e6c8eb6c0-md.jpg`,
    categorySlug: "hogar-y-decoracion",
    shortDescription: "Delicadeza y emoción en una sola figura.",
    description:
      "Figura escultórica que combina mariposa y corazón, símbolo de transformación y afecto. Un detalle tierno y elegante para regalar o para tus propios espacios.",
    stock: 12,
  },
  {
    id: 144048,
    slug: "figura-decorativa-piramide-moderna",
    name: "Figura decorativa pirámide moderna",
    price: 4190,
    image: `${CDN}/202601121528062636-1768240969446.jpg`,
    categorySlug: "hogar-y-decoracion",
    shortDescription: "Geometría serena de estilo contemporáneo.",
    description:
      "Figura geométrica en forma de pirámide, de estética moderna y minimalista. Aporta orden visual y un aire arquitectónico a tus repisas y escritorios.",
    stock: 14,
  },
  {
    id: 144049,
    slug: "escultura-decorativa-acostada-ala-dorada",
    name: "Escultura decorativa acostada ala dorada",
    price: 5990,
    image: `${CDN}/202601121530353585-1768241001912.jpg`,
    categorySlug: "hogar-y-decoracion",
    shortDescription: "Acento dorado de líneas suaves.",
    description:
      "Escultura decorativa acostada con detalle en dorado. Su acabado cálido realza mesas de centro y estanterías con un toque de lujo discreto.",
    stock: 8,
  },
  {
    id: 144050,
    slug: "figura-decorativa-perro-grande-dorado",
    name: "Figura decorativa perro grande dorado",
    price: 8690,
    image: `${CDN}/202601121540383299-1768241018588.jpg`,
    categorySlug: "hogar-y-decoracion",
    shortDescription: "Pieza statement en acabado dorado.",
    description:
      "Figura decorativa de perro en tamaño grande con acabado dorado. Una pieza con personalidad que se convierte en punto focal de living o recibidor.",
    featured: true,
    stock: 6,
  },
  {
    id: 144051,
    slug: "figura-decorativa-perro-dorado-pequeno",
    name: "Figura decorativa perro dorado pequeño",
    price: 3990,
    image: `${CDN}/202601121539532301-1768240981200.jpg`,
    categorySlug: "hogar-y-decoracion",
    shortDescription: "El detalle dorado en formato compacto.",
    description:
      "Versión pequeña de la figura decorativa de perro dorado. Ideal para sumar un acento cálido en repisas, escritorios o mesas auxiliares.",
    stock: 10,
  },
  {
    id: 144053,
    slug: "escultura-decorativa-corazon-moderno",
    name: "Escultura decorativa corazón moderno",
    price: 4990,
    image: `${CDN}/202601121537331186-1768241052915.jpg`,
    categorySlug: "hogar-y-decoracion",
    shortDescription: "Un corazón de líneas limpias y actuales.",
    description:
      "Escultura de corazón con diseño moderno y minimalista. Un símbolo cálido que aporta emoción sin recargar la decoración.",
    stock: 12,
  },
];

// --- Helpers (async para permitir migrar a base de datos sin cambiar las páginas) ---

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const feat = products.filter((p) => p.featured);
  return (feat.length ? feat : products).slice(0, limit);
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  return products.filter((p) => p.categorySlug === slug);
}

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
