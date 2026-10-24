import Link from "next/link";
import { categories } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { saveProduct } from "@/app/admin/actions";
import { ImageInput } from "./ImageInput";
import { SubmitButton } from "./FormButtons";
import { Card, Field, inputClass } from "./ui";

export function ProductForm({ product }: { product?: Product }) {
  return (
    <form action={saveProduct} className="mt-6 space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      <Card className="space-y-5">
        <Field label="Nombre">
          <input name="name" required defaultValue={product?.name} className={inputClass} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Precio (CLP)" hint="Sin puntos. Ej: 4990">
            <input name="price" type="number" min={1} step={1} required defaultValue={product?.price} className={inputClass} />
          </Field>
          <Field label="Stock" hint="Unidades disponibles">
            <input name="stock" type="number" min={0} step={1} required defaultValue={product?.stock ?? 0} className={inputClass} />
          </Field>
          <Field label="Categoría">
            <select name="category" defaultValue={product?.categorySlug ?? categories[0].slug} className={inputClass}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </Field>
        </div>

        <ImageInput name="image_file" urlName="image_url" defaultUrl={product?.image} label="Foto del producto" />
      </Card>

      <Card className="space-y-5">
        <Field label="Descripción corta" hint="Una frase. Aparece en buscadores y al compartir el producto.">
          <input name="short_description" maxLength={300} defaultValue={product?.shortDescription} className={inputClass} />
        </Field>
        <Field label="Descripción completa">
          <textarea name="description" rows={5} defaultValue={product?.description} className={inputClass} />
        </Field>
      </Card>

      <Card className="space-y-3">
        <label className="flex items-center gap-3">
          <input type="checkbox" name="active" defaultChecked={product?.active !== false} className="h-4 w-4 accent-[var(--dorado)]" />
          <span>Visible en la tienda</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" name="featured" defaultChecked={product?.featured} className="h-4 w-4 accent-[var(--dorado)]" />
          <span>Destacado (aparece primero en “Quiénes somos”)</span>
        </label>
        <Field
          label="Dirección web (opcional)"
          hint={`Se crea sola a partir del nombre. Quedará como somosroa.cl/producto/${product?.slug ?? "nombre-del-producto"}`}
        >
          <input name="slug" defaultValue={product?.slug} className={inputClass} />
        </Field>
      </Card>

      <div className="flex items-center gap-4">
        <SubmitButton>{product ? "Guardar cambios" : "Agregar producto"}</SubmitButton>
        <Link href="/admin/productos" className="text-sm text-tinta-70 hover:text-dorado">Cancelar</Link>
      </div>
    </form>
  );
}
