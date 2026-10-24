import Link from "next/link";
import type { Post } from "@/lib/types";
import { savePost } from "@/app/admin/actions";
import { ImageInput } from "./ImageInput";
import { SubmitButton } from "./FormButtons";
import { Card, Field, inputClass } from "./ui";

export function PostForm({ post }: { post?: Post }) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <form action={savePost} className="mt-6 space-y-6">
      {post && <input type="hidden" name="original_slug" value={post.slug} />}

      <Card className="space-y-5">
        <Field label="Título">
          <input name="title" required defaultValue={post?.title} className={inputClass} />
        </Field>
        <Field label="Resumen" hint="Una o dos frases. Se ve en la lista del blog y en Google.">
          <textarea name="excerpt" rows={2} maxLength={400} defaultValue={post?.excerpt} className={inputClass} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Categoría" hint="Ej: Bienestar, Inspiración, Guías">
            <input name="category" defaultValue={post?.category} className={inputClass} />
          </Field>
          <Field label="Fecha">
            <input name="date" type="date" defaultValue={post?.date ?? today} className={inputClass} />
          </Field>
        </div>
        <ImageInput name="cover_file" urlName="cover_url" defaultUrl={post?.cover} label="Foto de portada" />
      </Card>

      <Card>
        <Field label="Contenido" hint="Deja una línea en blanco entre párrafos.">
          <textarea
            name="content"
            rows={16}
            required
            defaultValue={post?.content.join("\n\n")}
            className={`${inputClass} leading-relaxed`}
          />
        </Field>
      </Card>

      <Card className="space-y-4">
        <label className="flex items-center gap-3">
          <input type="checkbox" name="published" defaultChecked={post?.published !== false} className="h-4 w-4 accent-[var(--dorado)]" />
          <span>Publicado (si lo desmarcas queda como borrador, sin mostrarse en el blog)</span>
        </label>
        <Field
          label="Dirección web (opcional)"
          hint={`Se crea sola a partir del título. Quedará como somosroa.cl/blog/${post?.slug ?? "titulo-del-articulo"}`}
        >
          <input name="slug" defaultValue={post?.slug} className={inputClass} />
        </Field>
      </Card>

      <div className="flex items-center gap-4">
        <SubmitButton>{post ? "Guardar cambios" : "Publicar artículo"}</SubmitButton>
        <Link href="/admin/blog" className="text-sm text-tinta-70 hover:text-dorado">Cancelar</Link>
      </div>
    </form>
  );
}
