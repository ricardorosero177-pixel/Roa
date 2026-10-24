export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number; // en CLP, entero
  image: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  featured?: boolean;
  stock?: number;
  active?: boolean; // false = oculto en la tienda (solo visible en el panel)
};

export type Review = {
  id?: number;
  name: string;
  text: string;
  rating: number; // 1 a 5
  visible?: boolean;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  cover: string;
  readingMinutes: number;
  content: string[]; // párrafos
  published?: boolean; // false = borrador
};

export type Quote = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  items?: { id: number; name: string; qty: number; price: number }[];
  createdAt?: string;
};
