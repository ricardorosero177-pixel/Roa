import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog | Inspiración para tu hogar",
  description:
    "Ideas de decoración minimalista, guías y tendencias atemporales para transformar tu hogar. El blog de RÖA.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container-roa py-12">
      <h1 className="font-display text-4xl">Blog</h1>
      <p className="mt-2 max-w-xl text-tinta-70">
        Inspiración, ideas de decoración y la historia detrás de cada pieza.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.slug} className="card-hover overflow-hidden rounded-2xl border border-linea">
            <Link href={`/blog/${post.slug}`}>
              <div className="relative aspect-[16/10]">
                <Image src={post.cover} alt={post.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
              </div>
            </Link>
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs text-tinta-70">
                <span className="uppercase tracking-wide text-dorado">{post.category}</span>
                <span>·</span>
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("es-CL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
              <h2 className="mt-2 font-display text-xl leading-snug">
                <Link href={`/blog/${post.slug}`} className="hover:text-dorado">{post.title}</Link>
              </h2>
              <p className="mt-2 text-sm text-tinta-70">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="mt-3 inline-block text-sm underline hover:text-dorado">
                Leer más
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
