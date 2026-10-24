import { requireAdmin } from "@/lib/admin";
import { getAllReviews } from "@/lib/reviews";
import type { Review } from "@/lib/types";
import { saveReview, deleteReview } from "../../actions";
import { ConfirmButton, SubmitButton } from "@/components/admin/FormButtons";
import { Card, Flash, inputClass, type PanelSearchParams } from "@/components/admin/ui";

function ReviewFields({ review }: { review?: Review }) {
  return (
    <>
      {review?.id && <input type="hidden" name="id" value={review.id} />}
      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
        <label className="block">
          <span className="text-xs text-tinta-70">Nombre de la clienta</span>
          <input name="name" required maxLength={80} defaultValue={review?.name} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-xs text-tinta-70">Estrellas</span>
          <select name="rating" defaultValue={review?.rating ?? 5} className={inputClass}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{"★".repeat(n)} ({n})</option>
            ))}
          </select>
        </label>
      </div>
      <label className="mt-4 block">
        <span className="text-xs text-tinta-70">Reseña</span>
        <textarea name="text" required rows={3} maxLength={600} defaultValue={review?.text} className={inputClass} />
      </label>
      <label className="mt-3 flex items-center gap-3 text-sm">
        <input type="checkbox" name="visible" defaultChecked={review?.visible !== false} className="h-4 w-4 accent-[var(--dorado)]" />
        <span>Mostrar en la página de inicio</span>
      </label>
    </>
  );
}

export default async function ResenasPage({ searchParams }: { searchParams: PanelSearchParams }) {
  await requireAdmin();
  const reviews = await getAllReviews();

  return (
    <div className="mt-8 max-w-3xl">
      <h2 className="font-display text-xl">Reseñas ({reviews.length})</h2>
      <p className="mt-1 text-sm text-tinta-70">
        Se muestran en la página de inicio, en este orden. Lo ideal son 4 visibles.
      </p>
      <Flash searchParams={searchParams} />

      <div className="mt-6 space-y-4">
        {reviews.map((r) => (
          <Card key={r.id}>
            <form action={saveReview}>
              <ReviewFields review={r} />
              <div className="mt-4">
                <SubmitButton className="btn-ghost text-sm">Guardar</SubmitButton>
              </div>
            </form>
            <form action={deleteReview} className="mt-3 border-t border-linea pt-3">
              <input type="hidden" name="id" value={r.id} />
              <ConfirmButton message={`¿Eliminar la reseña de ${r.name}?`}>Eliminar reseña</ConfirmButton>
            </form>
          </Card>
        ))}
      </div>

      <h3 className="mt-10 font-display text-lg">Agregar reseña</h3>
      <Card className="mt-3">
        <form action={saveReview}>
          <ReviewFields />
          <div className="mt-4">
            <SubmitButton>Agregar reseña</SubmitButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
