import type { Metadata } from "next";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { JsonLd } from "@/components/JsonLd";
import { itemListSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tienda | Decoración, aromas y accesorios",
  description:
    "Explora los productos RÖA: floreros nórdicos, esculturas y figuras decorativas. Filtra por precio. Envío gratis en Santiago.",
  alternates: { canonical: "/tienda" },
};

type Search = { q?: string; cat?: string; order?: string };

function buildHref(base: Search, patch: Partial<Search>) {
  const params = new URLSearchParams();
  const merged = { ...base, ...patch };
  if (merged.q) params.set("q", merged.q);
  if (merged.cat) params.set("cat", merged.cat);
  if (merged.order) params.set("order", merged.order);
  const qs = params.toString();
  return qs ? `/tienda?${qs}` : "/tienda";
}

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const { q, cat, order } = sp;
  const [all, categories] = await Promise.all([getProducts(), getCategories()]);

  const query = (q ?? "").trim().toLowerCase();
  let products = all.filter((p) => {
    const matchQuery =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.shortDescription.toLowerCase().includes(query);
    const matchCat = !cat || p.categorySlug === cat;
    return matchQuery && matchCat;
  });

  if (order === "precio-asc") products = [...products].sort((a, b) => a.price - b.price);
  if (order === "precio-desc") products = [...products].sort((a, b) => b.price - a.price);

  // Solo mostramos como filtro las categorías que tienen productos.
  const catsWithProducts = categories.filter((c) =>
    all.some((p) => p.categorySlug === c.slug),
  );

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm transition-colors ${
      active
        ? "border-dorado bg-dorado text-white"
        : "border-linea text-tinta-70 hover:border-dorado hover:text-dorado"
    }`;

  const sortOptions = [
    { key: "", label: "Novedades" },
    { key: "precio-asc", label: "Precio: menor a mayor" },
    { key: "precio-desc", label: "Precio: mayor a menor" },
  ];

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

      {/* Filtro por categoría (solo si hay más de una) */}
      {catsWithProducts.length > 1 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href={buildHref(sp, { cat: undefined })} className={chip(!cat)}>Todo</Link>
          {catsWithProducts.map((c) => (
            <Link key={c.slug} href={buildHref(sp, { cat: c.slug })} className={chip(cat === c.slug)}>
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {/* Orden */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-tinta-70">
        <span>Ordenar:</span>
        {sortOptions.map((o) => {
          const active = (order ?? "") === o.key;
          return (
            <Link
              key={o.key || "default"}
              href={buildHref(sp, { order: o.key || undefined })}
              className={`transition-colors ${active ? "text-dorado" : "hover:text-dorado"}`}
            >
              {o.label}
            </Link>
          );
        })}
        <span className="ml-auto text-tinta-50">{products.length} productos</span>
      </div>

      {query && (
        <p className="mt-4 text-sm text-tinta-70">
          Resultados para <strong>&ldquo;{q}&rdquo;</strong>
        </p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="mt-10 text-tinta-70">No encontramos productos con esos filtros.</p>
      )}
    </div>
  );
}
