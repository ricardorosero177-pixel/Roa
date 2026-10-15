import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import { saveOrder } from "@/lib/orders";

export const runtime = "nodejs";

/**
 * Webhook de MercadoPago. Recibe avisos de pago, consulta el estado real
 * y guarda el pedido. Siempre responde 200 para que MercadoPago no reintente en bucle.
 */
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const body = await request.json().catch(() => ({} as Record<string, unknown>));

    const type = (body?.type as string) || url.searchParams.get("type") || url.searchParams.get("topic");
    const dataId =
      (body?.data as { id?: string })?.id ||
      url.searchParams.get("data.id") ||
      url.searchParams.get("id");

    if (type !== "payment" || !dataId) {
      return NextResponse.json({ ok: true });
    }

    const client = mpClient();
    if (!client) return NextResponse.json({ ok: true });

    const payment = await new Payment(client).get({ id: String(dataId) });

    const meta = (payment.metadata ?? {}) as Record<string, string>;
    await saveOrder({
      mpPaymentId: String(payment.id),
      status: String(payment.status ?? "unknown"),
      amount: Number(payment.transaction_amount ?? 0),
      email: payment.payer?.email ?? meta.correo ?? undefined,
      items: (payment.additional_info?.items ?? []).map((it) => ({
        title: String(it.title ?? ""),
        quantity: Number(it.quantity ?? 1),
        unit_price: Number(it.unit_price ?? 0),
      })),
      customer: {
        nombre: meta.nombre,
        correo: meta.correo,
        whatsapp: meta.whatsapp,
        direccion: meta.direccion,
        comuna: meta.comuna,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[webhook mp] error:", e instanceof Error ? e.message : e);
    // Respondemos 200 igualmente para evitar reintentos infinitos.
    return NextResponse.json({ ok: true });
  }
}
