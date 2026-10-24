import { requireAdmin } from "@/lib/admin";
import { listQuotes } from "@/lib/quotes";
import { isSupabaseConfigured } from "@/lib/supabase";
import { formatCLP } from "@/lib/format";
import { deleteQuote } from "../../actions";
import { ConfirmButton } from "@/components/admin/FormButtons";
import { Card, Flash, type PanelSearchParams } from "@/components/admin/ui";

export default async function CotizacionesPage({ searchParams }: { searchParams: PanelSearchParams }) {
  await requireAdmin();
  const quotes = await listQuotes();

  return (
    <div className="mt-8">
      <h2 className="font-display text-xl">Cotizaciones ({quotes.length})</h2>
      <Flash searchParams={searchParams} />

      {quotes.length === 0 && (
        <p className="mt-4 text-tinta-70">
          Aún no hay cotizaciones. Arma un carrito y envía una desde la tienda para probar.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {quotes.map((q) => {
          const total = (q.items ?? []).reduce((n, it) => n + it.price * it.qty, 0);
          const phone = q.phone.replace(/\D/g, "");
          return (
            <Card key={q.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{q.name}</p>
                  <p className="text-sm text-tinta-70">{q.email} · {q.phone}</p>
                </div>
                <p className="text-sm text-tinta-70">
                  {q.createdAt ? new Date(q.createdAt).toLocaleString("es-CL") : ""}
                </p>
              </div>
              {q.description && <p className="mt-3 text-sm">{q.description}</p>}
              {(q.items ?? []).length > 0 && (
                <ul className="mt-3 border-t border-linea pt-3 text-sm text-tinta-70">
                  {q.items!.map((it) => (
                    <li key={it.id} className="flex justify-between">
                      <span>{it.qty} × {it.name}</span>
                      <span>{formatCLP(it.price * it.qty)}</span>
                    </li>
                  ))}
                  <li className="mt-1 flex justify-between font-medium text-tinta">
                    <span>Total</span>
                    <span>{formatCLP(total)}</span>
                  </li>
                </ul>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                {phone && (
                  <a
                    href={`https://wa.me/${phone.startsWith("56") ? phone : `56${phone}`}`}
                    target="_blank"
                    rel="noopener"
                    className="link-underline"
                  >
                    Responder por WhatsApp
                  </a>
                )}
                <a href={`mailto:${q.email}`} className="link-underline">Responder por correo</a>
                {isSupabaseConfigured() && q.id && (
                  <form action={deleteQuote} className="ml-auto">
                    <input type="hidden" name="id" value={q.id} />
                    <ConfirmButton message={`¿Eliminar la cotización de ${q.name}?`}>Eliminar</ConfirmButton>
                  </form>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
