import { requireAdmin } from "@/lib/admin";
import { PostForm } from "@/components/admin/PostForm";
import { Flash, type PanelSearchParams } from "@/components/admin/ui";

export default async function NuevoArticuloPage({ searchParams }: { searchParams: PanelSearchParams }) {
  await requireAdmin();
  return (
    <div className="mt-8 max-w-3xl">
      <h2 className="font-display text-xl">Escribir artículo</h2>
      <Flash searchParams={searchParams} />
      <PostForm />
    </div>
  );
}
