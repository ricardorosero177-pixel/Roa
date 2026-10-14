import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPostBySlug } from "@/lib/posts";
import { JsonLd } from "@/components/JsonLd";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.cover, width: 1200, height: 675, alt: post.title }],
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="container-roa max-w-3xl py-12">
      <JsonLd
        data={[
          blogPostingSchema(post),
          breadcrumbSchema([
            { name: "Inicio", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: post.title, url: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <nav className="mb-6 text-sm text-tinta-70" aria-label="miga de pan">
        <Link href="/" className="hover:text-dorado">Inicio</Link> /{" "}
        <Link href="/blog" className="hover:text-dorado">Blog</Link>
      </nav>

      <p className="text-sm uppercase tracking-wide text-dorado">{post.category}</p>
      <h1 className="mt-2 font-display text-3xl leading-tight md:text-4xl">{post.title}</h1>
      <div className="mt-3 flex items-center gap-2 text-sm text-tinta-70">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString("es-CL", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
        <span>·</span>
        <span>{post.readingMinutes} min de lectura</span>
      </div>

      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl">
        <Image src={post.cover} alt={post.title} fill priority sizes="(max-width:768px) 100vw, 768px" className="object-cover" />
      </div>

      <div className="prose mt-8 space-y-5 text-lg leading-relaxed text-tinta/90">
        {post.content.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-arena p-8 text-center">
        <h2 className="font-display text-2xl">Dale vida a tu espacio</h2>
        <p className="mx-auto mt-2 max-w-md text-tinta-70">
          Descubre las piezas que hacen la diferencia en nuestra tienda.
        </p>
        <Link href="/tienda" className="btn-dorado mt-5">Ver la tienda</Link>
      </div>
    </article>
  );
}
