import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts, getCategories } from "@/lib/catalog";
import { getPosts } from "@/lib/posts";
import { ProductCard } from "@/components/ProductCard";
import { site } from "@/lib/site";
import { formatCLP } from "@/lib/format";

export default async function HomePage() {
  const [featured, categories, posts] = await Promise.all([
    getFeaturedProducts(4),
    getCategories(),
    getPosts(),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="bg-arena">
        <div className="container-roa grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up">
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-dorado">
              Decoración minimalista
            </p>
            <h1 className="font-display text-4xl leading-tight md:text-5xl">
              Transforma tu hogar en minutos, sin gastar de más
            </h1>
            <p className="mt-5 max-w-md text-lg text-tinta-70">
              El detalle minimalista que hace que cualquier espacio se vea elegante y acogedor.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/tienda" className="btn-dorado">Ver la tienda</Link>
              <Link href="/quienes-somos" className="btn-ghost">Conócenos</Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl md:aspect-square">
            <Image
              src={featured[0]?.image ?? ""}
              alt="Decoración RÖA"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* VALOR */}
      <section className="border-y border-linea">
        <div className="container-roa grid gap-6 py-8 text-center sm:grid-cols-3">
          {[
            ["Envíos a todo Chile", "Coordinamos la entrega donde estés."],
            ["Diseño atemporal", "Piezas que no pasan de moda."],
            ["Atención cercana", "Te acompañamos por WhatsApp."],
          ].map(([t, d]) => (
            <div key={t}>
              <p className="font-medium">{t}</p>
              <p className="text-sm text-tinta-70">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="container-roa py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl">Favoritos de la casa</h2>
          <Link href="/tienda" className="text-sm underline hover:text-dorado">Ver todo</Link>
        </div>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="bg-arena">
        <div className="container-roa py-16">
          <h2 className="mb-8 font-display text-3xl">Explora por categoría</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {categories.map((c, i) => (
              <Link
                key={c.slug}
                href={`/categoria/${c.slug}`}
                className="card-hover group relative flex min-h-48 flex-col justify-end overflow-hidden rounded-3xl bg-tinta p-8 text-white"
              >
                <Image
                  src={featured[i]?.image ?? featured[0]?.image ?? ""}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-50 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="relative">
                  <h3 className="font-display text-2xl">{c.name}</h3>
                  <p className="mt-1 max-w-xs text-sm text-white/80">{c.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="container-roa grid items-center gap-10 py-20 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl">Más que decoración, una forma de vivir</h2>
          <p className="mt-5 text-tinta-70">
            {site.name} nace del amor por los espacios que se sienten bien. Creemos que un hogar no
            se construye solo con muebles, sino con detalles: objetos que cuentan historias y piezas
            que reflejan quién eres.
          </p>
          <p className="mt-4 text-tinta-70">
            No seguimos tendencias pasajeras; buscamos equilibrio, armonía y estilo atemporal.
          </p>
          <Link href="/quienes-somos" className="btn-ghost mt-6">Nuestra historia</Link>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image
            src={featured[2]?.image ?? featured[0]?.image ?? ""}
            alt="Historia RÖA"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* BLOG */}
      <section className="bg-arena">
        <div className="container-roa py-16">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-3xl">Inspiración</h2>
            <Link href="/blog" className="text-sm underline hover:text-dorado">Ver el blog</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card-hover overflow-hidden rounded-2xl bg-white"
              >
                <div className="relative aspect-[16/10]">
                  <Image src={post.cover} alt={post.title} fill sizes="33vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wide text-dorado">{post.category}</p>
                  <h3 className="mt-2 font-display text-lg leading-snug">{post.title}</h3>
                  <p className="mt-2 text-sm text-tinta-70">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA cotización */}
      <section className="container-roa py-20 text-center">
        <h2 className="font-display text-3xl">¿Buscas algo especial?</h2>
        <p className="mx-auto mt-3 max-w-md text-tinta-70">
          Cuéntanos qué necesitas y te preparamos una cotización personalizada. Desde {formatCLP(1290)}.
        </p>
        <Link href="/carrito" className="btn-dorado mt-6">Solicitar cotización</Link>
      </section>
    </>
  );
}
