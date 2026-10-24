import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { getAllProducts } from "@/lib/catalog";
import { ProductForm } from "@/components/admin/ProductForm";
import { Flash, type PanelSearchParams } from "@/components/admin/ui";

export default async function EditarProductoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: PanelSearchParams;
}) {
  await requireAdmin();
  const { id } = await params;
  const product = (await getAllProducts()).find((p) => p.id === Number(id));
  if (!product) notFound();

  return (
    <div className="mt-8 max-w-2xl">
      <h2 className="font-display text-xl">Editar: {product.name}</h2>
      <Flash searchParams={searchParams} />
      <ProductForm product={product} />
    </div>
  );
}
