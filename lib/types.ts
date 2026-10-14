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
