import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { listQuotes } from "@/lib/quotes";
import { listOrders } from "@/lib/orders";
import { isSupabaseConfigured } from "@/lib/supabase";
import { isMercadoPagoConfigured } from "@/lib/mercadopago";
import { site } from "@/lib/site";
import { formatCLP } from "@/lib/format";
import {
  SESSION_COOKIE,
  createSessionToken,
  verifySessionToken,
  verifyPassword,
} from "@/lib/auth";

export const metadata: Metadata = {
  title: "Panel RÖA",
  robots: { index: false, follow: false },
};

async function login(formData: FormData) {
  "use server";
  const pass = String(formData.get("password") ?? "");
  if (verifyPassword(pass)) {
    const jar = await cookies();
    jar.set(SESSION_COOKIE, createSessionToken(8), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
  }
  redirect("/admin");
}

async function logout() {
  "use server";
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin");
}

export default async function AdminPage() {
  const jar = await cookies();
  const authed = verifySessionToken(jar.get(SESSION_COOKIE)?.value);
  const passwordSet = Boolean(process.env.ADMIN_PASSWORD);

  if (!authed) {
    return (
      <div className="container-roa flex min-h-[60vh] items-center justify-center py-16">
        <form action={login} className="w-full max-w-sm rounded-2xl border border-linea bg-white p-8">
          <h1 className="font-display text-2xl">Panel RÖA</h1>
          <p className="mt-1 text-sm text-tinta-70">Ingresa la contraseña para administrar la tienda.</p>
          {!passwordSet && (
            <p className="mt-3 rounded bg-arena p-2 text-xs text-tinta-70">
              Falta definir <code>ADMIN_PASSWORD</code> en las variables de entorno.
            </p>
          )}
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Contraseña"
            className="mt-4 w-full rounded-lg border border-linea px-3 py-2 outline-none focus:border-dorado"
          />
          <button type="submit" className="btn-dorado mt-4 w-full">Entrar</button>
        </form>
      </div>
    );
  }

  const [quotes, orders] = await Promise.all([listQuotes(), listOrders()]);
  const statusLabel: Record<string, string> = {
    approved: "Pagado",
    pending: "Pendiente",
    in_process: "En proceso",
    rejected: "Rechazado",
    refunded: "Reembolsado",
    cancelled: "Cancelado",
  };
  const marketing = [
    ["Google Tag Manager", site.analytics.gtmId],
    ["Google Analytics 4", site.analytics.ga4Id],
    ["Google Ads", site.analytics.googleAdsId],
    ["Meta Pixel", site.analytics.metaPixelId],
  ] as const;

  return (
    <div className="container-roa py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Panel</h1>
        <form action={logout}>
          <button className="btn-ghost text-sm">Salir</button>
        </form>
      </div>

      {/* Estado de marketing */}
      <section className="mt-8">
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

      {/* Pedidos (MercadoPago) */}
      <section className="mt-12">
        <h2 className="font-display text-xl">Pedidos</h2>
        {!isMercadoPagoConfigured() && (
          <p className="mt-3 rounded-lg border border-linea bg-white p-4 text-sm text-tinta-70">
            MercadoPago aún no está configurado. Agrega <code>MERCADOPAGO_ACCESS_TOKEN</code> para
            recibir pagos online y verlos aquí.
          </p>
        )}
        {isMercadoPagoConfigured() && orders.length === 0 && (
          <p className="mt-4 text-tinta-70">Aún no hay pedidos pagados.</p>
        )}
        <div className="mt-4 space-y-3">
          {orders.map((o) => (
            <div key={o.mpPaymentId} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-linea bg-white p-5">
              <div>
                <p className="font-medium">
                  {statusLabel[o.status] ?? o.status}
                  <span className="ml-2 text-sm text-tinta-50">#{o.mpPaymentId}</span>
                </p>
                <p className="text-sm text-tinta-70">
                  {(o.items ?? []).map((it) => `${it.quantity}× ${it.title}`).join(", ")}
                </p>
                {o.customer?.nombre && (
                  <p className="mt-1 text-sm text-tinta">
                    {o.customer.nombre} · {o.customer.whatsapp} · {o.customer.correo}
                    <br />
                    {o.customer.direccion}, {o.customer.comuna}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-display text-lg">{formatCLP(o.amount)}</p>
                <p className="text-xs text-tinta-50">
                  {o.createdAt ? new Date(o.createdAt).toLocaleString("es-CL") : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cotizaciones */}
      <section className="mt-12">
        <h2 className="font-display text-xl">Cotizaciones</h2>

        {!isSupabaseConfigured() && (
          <p className="mt-3 rounded-lg border border-linea bg-white p-4 text-sm text-tinta-70">
            Modo local: las cotizaciones se guardan en este computador. Al conectar Supabase y
            desplegar, se guardarán en la nube y las verás desde cualquier lugar.
          </p>
        )}

        {quotes.length === 0 && (
          <p className="mt-4 text-tinta-70">
            Aún no hay cotizaciones. Arma un carrito y envía una desde la tienda para probar.
          </p>
        )}

        <div className="mt-4 space-y-4">
          {quotes.map((q) => {
            const total = (q.items ?? []).reduce((n, it) => n + it.price * it.qty, 0);
            return (
              <div key={q.id} className="rounded-2xl border border-linea bg-white p-5">
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
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
