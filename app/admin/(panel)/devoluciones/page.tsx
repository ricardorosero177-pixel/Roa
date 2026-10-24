import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { editablePages, getPage } from "@/lib/pages";
import { savePage } from "../../actions";
import { SubmitButton } from "@/components/admin/FormButtons";
import { Card, Field, Flash, inputClass, type PanelSearchParams } from "@/components/admin/ui";

export default async function DevolucionesAdminPage({
  searchParams,
}: {
  searchParams: PanelSearchParams;
}) {
  await requireAdmin();
  const slug = "politicas-devolucion";
  const page = await getPage(slug);
  const { path } = editablePages[slug];

  return (
    <div className="mt-8 max-w-3xl">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-xl">Política de devoluciones</h2>
        <Link href={path} target="_blank" className="text-sm text-tinta-70 hover:text-dorado">
          Ver en la tienda ↗
        </Link>
      </div>
      <Flash searchParams={searchParams} />

      <form action={savePage} className="mt-6 space-y-6">
        <input type="hidden" name="slug" value={slug} />

        <Card className="space-y-5">
          <Field label="Título">
            <input name="title" required maxLength={120} defaultValue={page.title} className={inputClass} />
          </Field>
          <Field label="Introducción" hint="El texto corto que va debajo del título.">
            <textarea name="intro" rows={2} maxLength={600} defaultValue={page.intro} className={inputClass} />
          </Field>
        </Card>

        <Card>
          <Field
            label="Contenido"
            hint={
              'Deja una línea en blanco entre párrafos. Para un título de sección empieza la línea con "## ". ' +
              'Para una lista numerada usa "1. ", "2. "… y para puntos usa "- ".'
            }
          >
            <textarea
              name="content"
              rows={22}
              required
              defaultValue={page.content}
              className={`${inputClass} font-mono text-sm leading-relaxed`}
            />
          </Field>
        </Card>

        <SubmitButton>Guardar cambios</SubmitButton>
      </form>
    </div>
  );
}
