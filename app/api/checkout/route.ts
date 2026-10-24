import { NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import { site } from "@/lib/site";
import { getProducts } from "@/lib/catalog";

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
    const rawItems: Partial<Item>[] = Array.isArray(body.items) ? body.items.slice(0, 50) : [];

    // Nombre y precio salen del catálogo, nunca del navegador: así nadie puede
    // pagar un precio modificado. El navegador solo aporta id y cantidad.
    const catalog = new Map((await getProducts()).map((p) => [p.id, p]));
    const items = [];
    for (const it of rawItems) {
      const product = catalog.get(Number(it?.id));
      if (!product) continue;
      const quantity = Math.min(999, Math.max(1, Math.floor(Number(it?.qty) || 1)));
      const stock = product.stock ?? 0;
      if (stock < quantity) {
        const error =
          stock > 0
            ? `De "${product.name}" solo quedan ${stock}. Ajusta la cantidad en el carrito.`
            : `"${product.name}" está agotado. Quítalo del carrito o escríbenos por WhatsApp.`;
        return NextResponse.json({ ok: false, error }, { status: 409 });
      }
      items.push({
        id: String(product.id),
        title: product.name.slice(0, 200),
        quantity,
        unit_price: product.price,
        currency_id: "CLP",
      });
    }

    if (items.length === 0) {
      return NextResponse.json({ ok: false, error: "Carrito vacío" }, { status: 400 });
    }

    // Datos del cliente (para contactarlo y coordinar la entrega)
    const c = (body.customer ?? {}) as Record<string, string>;
    const clean = (v: unknown, max = 120) => String(v ?? "").trim().slice(0, max);
    const customer = {
      name: clean(c.name),
      surname: clean(c.surname),
      email: clean(c.email, 160),
      whatsapp: clean(c.whatsapp, 40),
      direccion: clean(c.direccion, 200),
      comuna: clean(c.comuna, 120),
    };
    const phoneNumber = customer.whatsapp.replace(/\D/g, "").replace(/^56/, "");

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
        payer: {
          name: customer.name,
          surname: customer.surname,
          email: customer.email || undefined,
          phone: phoneNumber ? { area_code: "56", number: phoneNumber } : undefined,
          address: customer.direccion ? { street_name: customer.direccion } : undefined,
        },
        metadata: {
          nombre: `${customer.name} ${customer.surname}`.trim(),
          correo: customer.email,
          whatsapp: customer.whatsapp,
          direccion: customer.direccion,
          comuna: customer.comuna,
        },
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
