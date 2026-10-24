import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { listOrders, fulfillmentLabel } from "@/lib/orders";
import { listQuotes } from "@/lib/quotes";
import { getAllProducts } from "@/lib/catalog";
import { isMercadoPagoConfigured } from "@/lib/mercadopago";
import { formatCLP } from "@/lib/format";
import { site } from "@/lib/site";
import { Card } from "@/components/admin/ui";

const LOW_STOCK = 3;

function monthKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

export default async function ResumenPage() {
  await requireAdmin();
  const [orders, quotes, products] = await Promise.all([listOrders(), listQuotes(), getAllProducts()]);

  const paid = orders.filter((o) => o.status === "approved");
  const now = new Date();
  const thisMonth = monthKey(now);
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonth = monthKey(prev);

  const inMonth = (key: string) => paid.filter((o) => o.createdAt && monthKey(new Date(o.createdAt)) === key);
  const monthOrders = inMonth(thisMonth);
  const monthTotal = monthOrders.reduce((n, o) => n + Number(o.amount), 0);
  const prevTotal = inMonth(prevMonth).reduce((n, o) => n + Number(o.amount), 0);
  const avgTicket = monthOrders.length ? Math.round(monthTotal / monthOrders.length) : 0;
  const change = prevTotal > 0 ? Math.round(((monthTotal - prevTotal) / prevTotal) * 100) : null;

  // Ventas de los últimos 6 meses (incluido el actual)
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const total = inMonth(monthKey(d)).reduce((n, o) => n + Number(o.amount), 0);
    return { label: d.toLocaleDateString("es-CL", { month: "short" }).replace(".", ""), total };
  });
  const maxMonth = Math.max(...months.map((m) => m.total), 1);

  // Productos más vendidos (por unidades, en todos los pedidos pagados)
  const sold = new Map<string, { units: number; revenue: number }>();
  for (const o of paid) {
    for (const it of o.items ?? []) {
      const s = sold.get(it.title) ?? { units: 0, revenue: 0 };
      s.units += it.quantity;
      s.revenue += it.quantity * it.unit_price;
      sold.set(it.title, s);
    }
  }
  const top = [...sold.entries()].sort((a, b) => b[1].units - a[1].units).slice(0, 5);

  const toShip = paid.filter((o) => o.fulfillment === "nuevo" || o.fulfillment === "preparando");
  const lowStock = products.filter((p) => p.active !== false && (p.stock ?? 0) <= LOW_STOCK);
  const quotesThisMonth = quotes.filter(
    (q) => q.createdAt && monthKey(new Date(q.createdAt)) === thisMonth,
  ).length;

  const marketing = [
    ["Google Tag Manager", site.analytics.gtmId],
    ["Google Analytics 4", site.analytics.ga4Id],
    ["Google Ads", site.analytics.googleAdsId],
    ["Meta Pixel", site.analytics.metaPixelId],
  ] as const;

  return (
    <div className="mt-8 space-y-12">
      {/* Indicadores del mes */}
      <section>
        <h2 className="font-display text-xl">
          Este mes{" "}
          <span className="text-base text-tinta-50">
            ({now.toLocaleDateString("es-CL", { month: "long", year: "numeric" })})
          </span>
        </h2>
        {!isMercadoPagoConfigured() && (
          <p className="mt-2 text-sm text-tinta-70">
            MercadoPago aún no está configurado: las ventas online aparecerán aquí cuando lo esté.
          </p>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm text-tinta-70">Vendido</p>
            <p className="mt-1 font-display text-3xl">{formatCLP(monthTotal)}</p>
            {change !== null && (
              <p className="mt-1 text-xs text-tinta-50">
                {change >= 0 ? "▲" : "▼"} {Math.abs(change)}% vs. mes anterior
              </p>
            )}
          </Card>
          <Card>
            <p className="text-sm text-tinta-70">Pedidos pagados</p>
            <p className="mt-1 font-display text-3xl">{monthOrders.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-tinta-70">Ticket promedio</p>
            <p className="mt-1 font-display text-3xl">{formatCLP(avgTicket)}</p>
          </Card>
          <Card>
            <p className="text-sm text-tinta-70">Cotizaciones</p>
            <p className="mt-1 font-display text-3xl">{quotesThisMonth}</p>
          </Card>
        </div>
      </section>

      {/* Pendientes */}
      {(toShip.length > 0 || lowStock.length > 0) && (
        <section className="grid gap-3 md:grid-cols-2">
          {toShip.length > 0 && (
            <Card>
              <p className="font-medium">📦 {toShip.length} pedido{toShip.length > 1 ? "s" : ""} por despachar</p>
              <ul className="mt-2 space-y-1 text-sm text-tinta-70">
                {toShip.slice(0, 5).map((o) => (
                  <li key={o.mpPaymentId}>
                    {o.customer?.nombre || o.email || `#${o.mpPaymentId}`} ·{" "}
                    {fulfillmentLabel[o.fulfillment ?? "nuevo"]}
                  </li>
                ))}
              </ul>
              <Link href="/admin/pedidos" className="link-underline mt-3 inline-block text-sm">
                Ver pedidos
              </Link>
            </Card>
          )}
          {lowStock.length > 0 && (
            <Card>
              <p className="font-medium">⚠️ Stock bajo ({LOW_STOCK} o menos)</p>
              <ul className="mt-2 space-y-1 text-sm text-tinta-70">
                {lowStock.map((p) => (
                  <li key={p.id}>
                    <Link href={`/admin/productos/${p.id}`} className="hover:text-dorado">
                      {p.name}
                    </Link>{" "}
                    · {p.stock ?? 0} {(p.stock ?? 0) === 0 ? "(agotado)" : ""}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </section>
      )}

      {/* Ventas por mes */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <h2 className="font-display text-xl">Ventas de los últimos 6 meses</h2>
          {paid.length === 0 && (
            <p className="mt-1 text-sm text-tinta-70">
              Aún no hay ventas registradas. Las barras aparecerán con el primer pedido pagado.
            </p>
          )}
          <div className="mt-6 flex h-48 items-end gap-3 border-b border-linea" role="img" aria-label="Ventas por mes">
            {months.map((m) => (
              <div key={m.label} className="group relative flex h-full flex-1 flex-col justify-end">
                <span className="pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded bg-tinta px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {formatCLP(m.total)}
                </span>
                <div
                  className="rounded-t bg-dorado transition-colors group-hover:bg-dorado-hover"
                  style={{ height: `${Math.max((m.total / maxMonth) * 100, m.total > 0 ? 2 : 0)}%` }}
                  title={`${m.label}: ${formatCLP(m.total)}`}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-3 text-center text-xs text-tinta-50">
            {months.map((m) => (
              <span key={m.label} className="flex-1 capitalize">{m.label}</span>
            ))}
          </div>
          <ul className="sr-only">
            {months.map((m) => (
              <li key={m.label}>{m.label}: {formatCLP(m.total)}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="font-display text-xl">Más vendidos</h2>
          {top.length === 0 ? (
            <p className="mt-4 text-sm text-tinta-70">Aún no hay ventas registradas.</p>
          ) : (
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-tinta-50">
                  <th className="pb-2 font-normal">Producto</th>
                  <th className="pb-2 text-right font-normal">Unid.</th>
                  <th className="pb-2 text-right font-normal">Total</th>
                </tr>
              </thead>
              <tbody>
                {top.map(([title, s]) => (
                  <tr key={title} className="border-t border-linea">
                    <td className="py-2 pr-2">{title}</td>
                    <td className="py-2 text-right tabular-nums">{s.units}</td>
                    <td className="py-2 text-right tabular-nums">{formatCLP(s.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </section>

      {/* Estado de marketing */}
      <section>
        <h2 className="font-display text-xl">Marketing digital</h2>
        <p className="mt-1 text-sm text-tinta-70">
          Las campañas se gestionan en Meta Ads y Google Ads. Aquí solo confirmas que el seguimiento
          del sitio está activo.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {marketing.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-linea bg-white p-4">
              <p className="text-sm">{label}</p>
              <p className={`mt-1 text-xs ${value ? "text-green-700" : "text-tinta-50"}`}>
                {value ? "● Configurado" : "○ Sin configurar"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
