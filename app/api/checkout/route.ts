import { NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import { site } from "@/lib/site";

export const runtime = "nodejs";

type Item = { id: number; name: string; qty: number; price: number };

export async function POST(request: Request) {
  const client = mpClient();
  if (!client) {
    return NextResponse.json(
      { ok: false, error: "MercadoPago no está configurado todavía." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const rawItems = Array.isArray(body.items) ? body.items.slice(0, 50) : [];

    const items = rawItems
      .map((it: Partial<Item>) => ({
        id: String(it?.id ?? ""),
        title: String(it?.name ?? "Producto").slice(0, 200),
        quantity: Math.min(999, Math.max(1, Math.floor(Number(it?.qty) || 1))),
        unit_price: Math.max(0, Math.floor(Number(it?.price) || 0)),
        currency_id: "CLP",
      }))
      .filter((it: { unit_price: number }) => it.unit_price > 0);

    if (items.length === 0) {
      return NextResponse.json({ ok: false, error: "Carrito vacío" }, { status: 400 });
    }

    // Detectar la dirección real desde la petición (funciona en Vercel sin configurar nada).
    const fwdHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const fwdProto = request.headers.get("x-forwarded-proto") || "https";
    const base = (fwdHost ? `${fwdProto}://${fwdHost}` : site.url).replace(/\/$/, "");
    const isPublic = base.startsWith("https://");

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items,
        back_urls: {
          success: `${base}/gracias?status=approved`,
          pending: `${base}/gracias?status=pending`,
          failure: `${base}/carrito?pago=error`,
        },
        // auto_return solo funciona con URLs públicas (https)
        ...(isPublic ? { auto_return: "approved" } : {}),
        statement_descriptor: "RÖA Home & Style",
        notification_url: `${base}/api/mercadopago/webhook`,
        external_reference: `roa-${Date.now()}`,
      },
    });

    return NextResponse.json({
      ok: true,
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al crear el pago";
    console.error("[checkout] error:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
