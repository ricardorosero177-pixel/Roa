import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { getAllPosts } from "@/lib/posts";
import { deletePost } from "../../actions";
import { ConfirmButton } from "@/components/admin/FormButtons";
import { Flash, type PanelSearchParams } from "@/components/admin/ui";

export default async function BlogAdminPage({ searchParams }: { searchParams: PanelSearchParams }) {
  await requireAdmin();
  const posts = await getAllPosts();

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl">Artículos del blog ({posts.length})</h2>
        <Link href="/admin/blog/nuevo" className="btn-dorado text-sm">+ Escribir artículo</Link>
      </div>
      <Flash searchParams={searchParams} />

      <ul className="mt-6 divide-y divide-linea rounded-2xl border border-linea bg-white">
        {posts.map((p) => (
          <li key={p.slug} className="flex flex-wrap items-center gap-4 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- miniatura del panel */}
            <img src={p.cover} alt="" className="h-16 w-24 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">
                {p.title}
                {p.published === false && (
                  <span className="ml-2 rounded bg-arena px-2 py-0.5 text-xs text-tinta-70">Borrador</span>
                )}
              </p>
              <p className="text-sm text-tinta-70">
                {p.category} · {new Date(`${p.date}T12:00:00`).toLocaleDateString("es-CL")} ·{" "}
                {p.readingMinutes} min de lectura
              </p>
            </div>
            <div className="flex w-full items-center justify-end gap-4 sm:w-auto">
              <Link href={`/admin/blog/${p.slug}`} className="btn-ghost text-sm">Editar</Link>
              <form action={deletePost}>
                <input type="hidden" name="slug" value={p.slug} />
                <ConfirmButton message={`¿Eliminar "${p.title}"? Esto no se puede deshacer.`}>
                  Eliminar
                </ConfirmButton>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
