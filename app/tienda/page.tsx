import type { Metadata } from "next";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { JsonLd } from "@/components/JsonLd";
import { itemListSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tienda | Decoración y accesorios",
  description:
    "Explora todos los productos RÖA: floreros nórdicos, esculturas y figuras decorativas minimalistas, y accesorios textiles. Envíos a todo Chile.",
  alternates: { canonical: "/tienda" },
};

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [all, categories] = await Promise.all([getProducts(), getCategories()]);

  const query = (q ?? "").trim().toLowerCase();
  const products = query
    ? all.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.shortDescription.toLowerCase().includes(query),
      )
    : all;

  return (
    <div className="container-roa py-12">
      <JsonLd
        data={[
          itemListSchema(products),
          breadcrumbSchema([
            { name: "Inicio", url: "/" },
            { name: "Tienda", url: "/tienda" },
          ]),
        ]}
      />
      <nav className="mb-4 text-sm text-tinta-70" aria-label="miga de pan">
        <Link href="/" className="hover:text-dorado">Inicio</Link> / <span>Tienda</span>
      </nav>

      <h1 className="font-display text-4xl">Tienda</h1>
      <p className="mt-2 max-w-xl text-tinta-70">
        Piezas elegidas con intención para dar calma y carácter a tus espacios.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/tienda" className="btn-ghost text-sm">Todo</Link>
        {categories.map((c) => (
          <Link key={c.slug} href={`/categoria/${c.slug}`} className="btn-ghost text-sm">
            {c.name}
          </Link>
        ))}
      </div>

      {query && (
        <p className="mt-6 text-sm text-tinta-70">
          Resultados para <strong>&ldquo;{q}&rdquo;</strong>: {products.length}
        </p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="mt-10 text-tinta-70">No encontramos productos. Prueba otra búsqueda.</p>
      )}
    </div>
  );
}
