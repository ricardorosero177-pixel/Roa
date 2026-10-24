import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { listOrders, fulfillmentLabel, fulfillmentSteps, type Fulfillment } from "@/lib/orders";
import { isMercadoPagoConfigured } from "@/lib/mercadopago";
import { formatCLP } from "@/lib/format";
import { updateOrder } from "../../actions";
import { SubmitButton } from "@/components/admin/FormButtons";
import { Card, Flash, inputClass } from "@/components/admin/ui";

const paymentLabel: Record<string, string> = {
  approved: "Pagado",
  pending: "Pago pendiente",
  in_process: "Pago en proceso",
  rejected: "Pago rechazado",
  refunded: "Reembolsado",
  cancelled: "Cancelado",
};

type Filter = "todos" | Fulfillment;

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; ver?: string }>;
}) {
  await requireAdmin();
  const { ver } = await searchParams;
  const filter: Filter = fulfillmentSteps.includes(ver as Fulfillment) ? (ver as Fulfillment) : "todos";
  const orders = await listOrders();
  const shown = filter === "todos" ? orders : orders.filter((o) => (o.fulfillment ?? "nuevo") === filter);
  const count = (f: Fulfillment) => orders.filter((o) => (o.fulfillment ?? "nuevo") === f).length;

  return (
    <div className="mt-8">
      <h2 className="font-display text-xl">Pedidos</h2>
      <Flash searchParams={searchParams} />

      {!isMercadoPagoConfigured() && (
        <p className="mt-3 rounded-lg border border-linea bg-white p-4 text-sm text-tinta-70">
          MercadoPago aún no está configurado. Agrega <code>MERCADOPAGO_ACCESS_TOKEN</code> para
          recibir pagos online y verlos aquí.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {(["todos", ...fulfillmentSteps] as Filter[]).map((f) => (
          <Link
            key={f}
            href={f === "todos" ? "/admin/pedidos" : `/admin/pedidos?ver=${f}`}
            className={`rounded-full border px-3 py-1 ${
              filter === f ? "border-dorado bg-dorado text-white" : "border-linea bg-white text-tinta-70 hover:border-dorado"
            }`}
          >
            {f === "todos" ? `Todos (${orders.length})` : `${fulfillmentLabel[f]} (${count(f)})`}
          </Link>
        ))}
      </div>

      {shown.length === 0 && <p className="mt-6 text-tinta-70">No hay pedidos aquí.</p>}

      <div className="mt-6 space-y-4">
        {shown.map((o) => {
          const phone = (o.customer?.whatsapp ?? "").replace(/\D/g, "");
          const wsp = phone
            ? `https://wa.me/${phone.startsWith("56") ? phone : `56${phone}`}?text=${encodeURIComponent(
                `Hola ${o.customer?.nombre ?? ""} 👋 Te escribimos de RÖA por tu pedido #${o.mpPaymentId}.`,
              )}`
            : null;
          return (
            <Card key={o.mpPaymentId}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {o.customer?.nombre || o.email || "Cliente"}
                    <span className="ml-2 text-sm text-tinta-50">#{o.mpPaymentId}</span>
                  </p>
                  <p className="text-sm text-tinta-70">
                    {o.createdAt ? new Date(o.createdAt).toLocaleString("es-CL") : ""} ·{" "}
                    <span className={o.status === "approved" ? "text-green-700" : ""}>
                      {paymentLabel[o.status] ?? o.status}
                    </span>
                  </p>
                </div>
                <p className="font-display text-xl">{formatCLP(Number(o.amount))}</p>
              </div>

              <ul className="mt-3 border-t border-linea pt-3 text-sm">
                {(o.items ?? []).map((it, i) => (
                  <li key={i} className="flex justify-between gap-4">
                    <span>{it.quantity} × {it.title}</span>
                    <span className="text-tinta-70">{formatCLP(it.quantity * it.unit_price)}</span>
                  </li>
                ))}
              </ul>

              {o.customer && (o.customer.direccion || o.customer.whatsapp || o.customer.correo) && (
                <div className="mt-3 rounded-lg bg-arena p-3 text-sm">
                  <p>📍 {[o.customer.direccion, o.customer.comuna].filter(Boolean).join(", ") || "Sin dirección"}</p>
                  <p className="mt-1 text-tinta-70">
                    {[o.customer.whatsapp, o.customer.correo].filter(Boolean).join(" · ")}
                  </p>
                  {wsp && (
                    <a href={wsp} target="_blank" rel="noopener" className="link-underline mt-2 inline-block">
                      Escribir por WhatsApp
                    </a>
                  )}
                </div>
              )}

              <form action={updateOrder} className="mt-4 grid gap-3 sm:grid-cols-[180px_1fr_auto] sm:items-end">
                <input type="hidden" name="mp_payment_id" value={o.mpPaymentId} />
                <label className="block">
                  <span className="text-xs text-tinta-70">Despacho</span>
                  <select name="fulfillment" defaultValue={o.fulfillment ?? "nuevo"} className={inputClass}>
                    {fulfillmentSteps.map((f) => (
                      <option key={f} value={f}>{fulfillmentLabel[f]}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs text-tinta-70">Nota interna (ej: código de seguimiento)</span>
                  <input name="notes" defaultValue={o.notes} className={inputClass} />
                </label>
                <SubmitButton className="btn-ghost text-sm">Guardar</SubmitButton>
              </form>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
