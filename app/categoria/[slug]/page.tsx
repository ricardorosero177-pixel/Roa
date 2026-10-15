import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategory, getProductsByCategory } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { JsonLd } from "@/components/JsonLd";
import { itemListSchema, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/categoria/${category.slug}` },
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(slug);

  return (
    <div className="container-roa py-12">
      <JsonLd
        data={[
          itemListSchema(products),
          breadcrumbSchema([
            { name: "Inicio", url: "/" },
            { name: "Tienda", url: "/tienda" },
            { name: category.name, url: `/categoria/${category.slug}` },
          ]),
        ]}
      />
      <nav className="mb-4 text-sm text-tinta-70" aria-label="miga de pan">
        <Link href="/" className="hover:text-dorado">Inicio</Link> /{" "}
        <Link href="/tienda" className="hover:text-dorado">Tienda</Link> /{" "}
        <span>{category.name}</span>
      </nav>

      <h1 className="font-display text-4xl">{category.name}</h1>
      <p className="mt-2 max-w-xl text-tinta-70">{category.description}</p>

      {products.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-linea bg-white p-12 text-center">
          <p className="eyebrow">Muy pronto</p>
          <h2 className="mt-3 font-display text-2xl">Estamos preparando esta colección</h2>
          <p className="mx-auto mt-3 max-w-md text-tinta-70">
            Estamos curando con calma los aromas que llegarán a RÖA. Escríbenos y te avisamos cuando
            estén disponibles.
          </p>
          <Link href="/tienda" className="btn-dorado mt-6">Ver el resto de la tienda</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
