import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { getAllProducts, getCategory } from "@/lib/catalog";
import { formatCLP } from "@/lib/format";
import { deleteProduct } from "../../actions";
import { ConfirmButton } from "@/components/admin/FormButtons";
import { Flash, type PanelSearchParams } from "@/components/admin/ui";

export default async function ProductosPage({ searchParams }: { searchParams: PanelSearchParams }) {
  await requireAdmin();
  const products = await getAllProducts();

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl">Productos ({products.length})</h2>
        <Link href="/admin/productos/nuevo" className="btn-dorado text-sm">+ Agregar producto</Link>
      </div>
      <Flash searchParams={searchParams} />

      <ul className="mt-6 divide-y divide-linea rounded-2xl border border-linea bg-white">
        {products.map((p) => {
          const stock = p.stock ?? 0;
          return (
            <li key={p.id} className="flex flex-wrap items-center gap-4 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element -- miniatura del panel */}
              <img src={p.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {p.name}
                  {p.active === false && (
                    <span className="ml-2 rounded bg-arena px-2 py-0.5 text-xs text-tinta-70">Oculto</span>
                  )}
                  {p.featured && (
                    <span className="ml-2 rounded bg-arena px-2 py-0.5 text-xs text-dorado-hover">Destacado</span>
                  )}
                </p>
                <p className="text-sm text-tinta-70">
                  {formatCLP(p.price)} · {getCategory(p.categorySlug)?.name ?? p.categorySlug} ·{" "}
                  <span className={stock === 0 ? "text-red-700" : stock <= 3 ? "text-dorado-hover" : ""}>
                    {stock === 0 ? "Agotado" : `Stock: ${stock}`}
                  </span>
                </p>
              </div>
              <div className="flex w-full items-center justify-end gap-4 sm:w-auto">
                <Link href={`/admin/productos/${p.id}`} className="btn-ghost text-sm">Editar</Link>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <ConfirmButton message={`¿Eliminar "${p.name}"? Esto no se puede deshacer. Si solo quieres dejar de mostrarlo, edítalo y desmarca "Visible en la tienda".`}>
                    Eliminar
                  </ConfirmButton>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
