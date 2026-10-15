"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart/CartContext";
import { formatCLP } from "@/lib/format";
import { whatsappLink } from "@/lib/site";

export function CartView() {
  const { items, total, setQty, remove } = useCart();
  const [paying, setPaying] = useState(false);
  const [serverError, setServerError] = useState("");

  async function payWithMercadoPago() {
    setServerError("");
    setPaying(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "No se pudo iniciar el pago.");
      const url = data.init_point || data.sandbox_init_point;
      if (!url) throw new Error("No se recibió el enlace de pago.");
      window.location.href = url;
    } catch (e) {
      setServerError(
        e instanceof Error ? e.message : "No se pudo iniciar el pago. Intenta de nuevo.",
      );
      setPaying(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-tinta-70">Tu carrito está vacío.</p>
        <Link href="/tienda" className="btn-dorado mt-5">Ver la tienda</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      {/* Items */}
      <div>
        <ul className="divide-y divide-linea">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-4">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-dorado">{formatCLP(item.price)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => setQty(item.id, item.qty - 1)} className="h-8 w-8 rounded-full border border-linea" aria-label="Quitar uno">−</button>
                  <span className="w-6 text-center">{item.qty}</span>
                  <button onClick={() => setQty(item.id, item.qty + 1)} className="h-8 w-8 rounded-full border border-linea" aria-label="Agregar uno">+</button>
                  <button onClick={() => remove(item.id)} className="ml-auto text-xs underline text-tinta-70">Eliminar</button>
                </div>
              </div>
              <div className="text-right font-medium">{formatCLP(item.price * item.qty)}</div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-linea pt-4">
          <span className="text-tinta-70">Total</span>
          <span className="font-display text-2xl">{formatCLP(total)}</span>
        </div>
      </div>

      {/* Resumen y pago */}
      <div className="h-fit rounded-2xl border border-linea bg-white p-6">
        <h2 className="font-display text-2xl">Resumen</h2>
        <div className="mt-4 flex items-center justify-between border-y border-linea py-3">
          <span className="text-tinta-70">Total</span>
          <span className="font-display text-xl">{formatCLP(total)}</span>
        </div>
        <p className="mt-3 text-sm text-tinta-70">
          Pago seguro con MercadoPago: tarjetas de crédito, débito y cuotas. Envío gratis en Santiago.
        </p>
        <button
          type="button"
          onClick={payWithMercadoPago}
          disabled={paying}
          className="btn-dorado mt-4 w-full disabled:opacity-60"
        >
          {paying ? "Redirigiendo a MercadoPago..." : "Ir a pagar"}
        </button>
        {serverError && <p className="mt-3 text-sm text-red-600">{serverError}</p>}
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener"
          className="mt-3 block text-center text-sm text-tinta-70 underline"
        >
          ¿Tienes dudas? Escríbenos por WhatsApp
        </a>
      </div>
    </div>
  );
}
