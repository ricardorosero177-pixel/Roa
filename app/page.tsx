import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/catalog";
import { getPosts } from "@/lib/posts";
import { ProductCard } from "@/components/ProductCard";
import { whatsappLink } from "@/lib/site";

export default async function HomePage() {
  const [products, posts] = await Promise.all([getProducts(), getPosts()]);

  return (
    <>
      {/* HERO — un solo video, responsivo (móvil a pantalla completa, escritorio en marco) */}
      <section className="w-full overflow-hidden bg-tinta md:bg-arena">
        <div className="md:container-roa md:grid md:grid-cols-[1fr_0.72fr] md:items-center md:gap-14 md:py-24">
          {/* Texto (solo escritorio) */}
          <div className="hidden animate-fade-up md:block">
            <p className="eyebrow">Bienestar para el hogar</p>
            <h1 className="mt-5 font-display text-6xl leading-[1.02] xl:text-7xl">
              Un hogar que se siente como calma
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-tinta-70">
              Decoración elegida con intención, para transformar tus espacios en momentos de armonía
              y bienestar.
            </p>
            <div className="mt-8">
              <Link href="/tienda" className="btn-dorado">Descubrir la colección</Link>
            </div>
          </div>

          {/* Video (mismo elemento para ambos tamaños) */}
          <div className="mx-auto w-full md:max-w-[360px]">
            <div className="relative h-[calc(100svh-7rem)] min-h-[500px] w-full md:h-auto md:aspect-[9/16] md:overflow-hidden md:rounded-[1.75rem] md:border md:border-linea md:bg-arena-100 md:shadow-[0_40px_80px_-28px_rgba(30,30,28,0.35)]">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src="/videos/roa-hero.mp4"
                poster="/videos/roa-hero-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
              {/* Degradado + botón: solo móvil */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent md:hidden" />
              <div className="absolute inset-x-0 bottom-0 flex justify-center pb-10 md:hidden">
                <Link href="/tienda" className="btn-dorado">Ver la colección</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES DE MARCA */}
      <section className="border-y border-linea">
        <div className="container-roa flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-6 text-center text-sm text-tinta-70">
          {["Curaduría consciente", "Diseño con intención", "Envío gratis en Santiago", "Atención cercana"].map(
            (t, i) => (
              <span key={t} className="flex items-center gap-10">
                {i > 0 && <span className="hidden text-dorado sm:inline">✦</span>}
                {t}
              </span>
            ),
          )}
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="container-roa py-20">
        <div className="mb-10 text-center">
          <p className="eyebrow">Nuestra colección</p>
          <h2 className="mt-3 font-display text-4xl">Decoración para tu hogar</h2>
          <p className="mx-auto mt-3 max-w-xl text-tinta-70">
            Piezas elegidas con intención para dar calma y carácter a tus espacios.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* AROMAS & PACKS — próximamente */}
      <section className="bg-arena-100">
        <div className="container-roa grid items-center gap-8 py-14 md:grid-cols-2">
          <div>
            <p className="eyebrow">Muy pronto</p>
            <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
              Aromas &amp; packs para tu hogar
            </h2>
            <p className="mt-4 max-w-md text-tinta-70">
              Estamos curando aromas que despiertan emociones y packs que combinan decoración y
              sensaciones. Déjanos tu WhatsApp y te avisamos primero.
            </p>
          </div>
          <div className="md:text-right">
            <a href={whatsappLink("Hola RÖA 👋 Quiero que me avisen cuando lleguen los aromas y packs.")} target="_blank" rel="noopener" className="btn-dorado">
              Quiero que me avisen
            </a>
          </div>
        </div>
      </section>

      {/* SENSACIONES */}
      <section className="bg-arena-100">
        <div className="container-roa py-20 text-center">
          <p className="eyebrow">Nuestra esencia</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl leading-snug md:text-4xl">
            No vendemos objetos. Creamos sensaciones.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-tinta-70">
            El cliente no compra un florero: compra la calma de llegar a casa. Cada pieza de RÖA
            existe para eso.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Calma", "Un respiro en medio del día."],
              ["Hogar acogedor", "Espacios que abrazan."],
              ["Belleza cotidiana", "Lo simple, bien hecho."],
              ["Momentos para ti", "Darte un gusto con sentido."],
            ].map(([t, d]) => (
              <div key={t}>
                <p className="font-display text-xl text-dorado">{t}</p>
                <p className="mt-2 text-sm text-tinta-70">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* FILOSOFÍA — segundo video en marco elegante */}
      <section className="bg-white">
        <div className="container-roa grid items-center gap-12 py-20 md:grid-cols-2">
          <div className="mx-auto w-full max-w-[340px]">
            <div className="relative aspect-[9/16] overflow-hidden rounded-[1.5rem] border border-linea bg-arena-100 shadow-[0_30px_70px_-24px_rgba(30,30,28,0.3)]">
              <video
                className="h-full w-full object-cover"
                src="/videos/roa-ambiente.mp4"
                poster="/videos/roa-ambiente-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
          </div>
          <div>
            <p className="eyebrow">Nuestra filosofía</p>
            <h2 className="mt-3 font-display text-4xl leading-tight">
              Habitar el hogar con más intención
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-tinta-70">
              RÖA nace para transformar objetos cotidianos en experiencias significativas. Creemos en
              la belleza simple, en los detalles elegidos con cuidado y en una estética que calma en
              lugar de saturar.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-tinta-70">
              No seguimos tendencias pasajeras; buscamos equilibrio, armonía y un estilo atemporal.
            </p>
            <Link href="/quienes-somos" className="btn-ghost mt-8">Conócenos</Link>
          </div>
        </div>
      </section>

      {/* CITA DE MARCA */}
      <section className="bg-arena-100">
        <div className="container-roa py-24 text-center">
          <p className="eyebrow">RÖA</p>
          <p className="mx-auto mt-6 max-w-3xl font-display text-3xl leading-snug text-tinta md:text-[2.6rem]">
            &ldquo;Cuando un espacio está en sintonía contigo, todo fluye mejor. Y eso, más que
            decoración, es una forma de vivir.&rdquo;
          </p>
        </div>
      </section>

      {/* TESTIMONIOS — reseñas reales de clientas (tienda RÖA) */}
      <section className="container-roa py-20">
        <div className="mb-10 text-center">
          <p className="eyebrow">Reseñas reales</p>
          <h2 className="mt-3 font-display text-4xl">Lo que dicen nuestras clientas</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "Camila Rojas",
              text: "Tuve dudas al principio pero todo salió bien. Me escribieron para coordinar y la entrega fue sin problema, lo recomiendo.",
            },
            {
              name: "Evelyn",
              text: "Muy buena, me llegaron y hermosos los productos.",
            },
            {
              name: "Javiera Sandoval",
              text: "Me encantó el de corazón, se ve muy hermoso en mi pieza. ¡Me encanta!",
            },
            {
              name: "Kendris Grijalva",
              text: "Me encantó el florero 😍 es tal cual como en la foto, súper lindo. Le dio un toque muy bonito a mi espacio. ¡Lo recomiendo!",
            },
          ].map((r) => (
            <figure key={r.name} className="flex flex-col rounded-2xl border border-linea bg-white p-6">
              <p className="text-dorado">★★★★★</p>
              <blockquote className="mt-3 flex-1 leading-relaxed text-tinta">&ldquo;{r.text}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm text-tinta-50">— {r.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* BLOG */}
      <section className="container-roa py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow">Diario</p>
            <h2 className="mt-3 font-display text-4xl">Inspiración</h2>
          </div>
          <Link href="/blog" className="link-underline hidden text-sm md:inline">Ver el blog</Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <div className="img-zoom relative aspect-[16/11] overflow-hidden rounded-xl">
                <Image src={post.cover} alt={post.title} fill sizes="33vw" className="object-cover" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-dorado">{post.category}</p>
              <h3 className="mt-2 font-display text-xl leading-snug transition-colors group-hover:text-dorado">
                {post.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-tinta-70">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-white">
        <div className="container-roa py-20 text-center">
          <h2 className="font-display text-4xl">¿Buscas algo especial?</h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-tinta-70">
            Cuéntanos qué necesitas y te ayudamos a elegir la pieza perfecta para tu espacio o para
            regalar con sentido.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/tienda" className="btn-dorado">Ver la tienda</Link>
            <a href={whatsappLink()} target="_blank" rel="noopener" className="btn-ghost">
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
