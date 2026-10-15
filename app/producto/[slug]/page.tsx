import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  products,
  getProductBySlug,
  getProductsByCategory,
  getCategory,
} from "@/lib/catalog";
import { formatCLP } from "@/lib/format";
import { ProductActions } from "@/components/ProductActions";
import { ProductCard } from "@/components/ProductCard";
import { JsonLd } from "@/components/JsonLd";
import { productSchema, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
      type: "website",
    },
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategory(product.categorySlug);
  const related = (await getProductsByCategory(product.categorySlug))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container-roa py-12">
      <JsonLd
        data={[
          productSchema(product),
          breadcrumbSchema([
            { name: "Inicio", url: "/" },
            { name: "Tienda", url: "/tienda" },
            ...(category
              ? [{ name: category.name, url: `/categoria/${category.slug}` }]
              : []),
            { name: product.name, url: `/producto/${product.slug}` },
          ]),
        ]}
      />

      <nav className="mb-6 text-sm text-tinta-70" aria-label="miga de pan">
        <Link href="/" className="hover:text-dorado">Inicio</Link> /{" "}
        <Link href="/tienda" className="hover:text-dorado">Tienda</Link>
        {category && (
          <>
            {" "}/{" "}
            <Link href={`/categoria/${category.slug}`} className="hover:text-dorado">
              {category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-white">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          {category && (
            <p className="text-sm uppercase tracking-wide text-dorado">{category.name}</p>
          )}
          <h1 className="mt-1 font-display text-3xl md:text-4xl">{product.name}</h1>
          <p className="mt-4 font-display text-2xl">{formatCLP(product.price)}</p>
          <p className="mt-5 text-tinta-70">{product.description}</p>

          {(product.stock ?? 0) > 0 ? (
            <p className="mt-4 text-sm text-green-700">● En stock</p>
          ) : (
            <p className="mt-4 text-sm text-tinta-70">● Consultar disponibilidad</p>
          )}

          <ProductActions product={product} />

          <p className="mt-6 text-xs text-tinta-70">
            Al agregar al carrito podrás ir a pagar con MercadoPago. Envío gratis en Santiago.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl">También te puede gustar</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
