import { requireAdmin } from "@/lib/admin";
import { ProductForm } from "@/components/admin/ProductForm";
import { Flash, type PanelSearchParams } from "@/components/admin/ui";

export default async function NuevoProductoPage({ searchParams }: { searchParams: PanelSearchParams }) {
  await requireAdmin();
  return (
    <div className="mt-8 max-w-2xl">
      <h2 className="font-display text-xl">Agregar producto</h2>
      <Flash searchParams={searchParams} />
      <ProductForm />
    </div>
  );
}
