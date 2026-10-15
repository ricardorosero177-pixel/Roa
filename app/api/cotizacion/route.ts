import { NextResponse } from "next/server";
import { createQuote } from "@/lib/quotes";

export const runtime = "nodejs";

// Límite de frecuencia simple por IP (best-effort, por instancia de servidor).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQ = 6;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear(); // evita crecimiento ilimitado
  return arr.length > MAX_REQ;
}

const clamp = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anon";

    if (rateLimited(ip)) {
      return NextResponse.json({ ok: false, error: "Demasiadas solicitudes" }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));

    // Honeypot anti-spam: campo oculto que un humano no llena.
    if (body.direccion) {
      return NextResponse.json({ ok: true });
    }

    const name = clamp(body.name, 120);
    const email = clamp(body.email, 160);
    const phone = clamp(body.phone, 40);
    const description = clamp(body.description, 2000);

    if (!name || !EMAIL.test(email) || phone.length < 3) {
      return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
    }

    // Validación y saneamiento de los ítems del carrito.
    const rawItems = Array.isArray(body.items) ? body.items.slice(0, 50) : [];
    const items = rawItems
      .map((it: Record<string, unknown>) => ({
        id: Number(it?.id) || 0,
        name: clamp(it?.name, 200),
        qty: Math.min(999, Math.max(1, Math.floor(Number(it?.qty) || 1))),
        price: Math.min(100000000, Math.max(0, Math.floor(Number(it?.price) || 0))),
      }))
      .filter((it: { id: number; name: string }) => it.id > 0 && it.name.length > 0);

    const result = await createQuote({ name, email, phone, description, items });
    if (!result.ok) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }
    return NextResponse.json({ ok: true, id: result.id });
  } catch {
    return NextResponse.json({ ok: false, error: "Error" }, { status: 500 });
  }
}
