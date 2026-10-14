import { NextResponse } from "next/server";
import { createQuote } from "@/lib/quotes";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot anti-spam: campo oculto que un humano no llena.
    if (body.direccion) {
      return NextResponse.json({ ok: true });
    }

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const description = String(body.description ?? "").trim();

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone) {
      return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
    }

    const result = await createQuote({
      name,
      email,
      phone,
      description,
      items: Array.isArray(body.items) ? body.items.slice(0, 50) : [],
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }
    return NextResponse.json({ ok: true, id: result.id });
  } catch {
    return NextResponse.json({ ok: false, error: "Error" }, { status: 500 });
  }
}
