"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./cart/CartContext";
import { formatCLP } from "@/lib/format";
import { trackLead } from "@/lib/track";

type Errors = Partial<Record<"name" | "email" | "phone" | "consent", string>>;

export function CartView() {
  const { items, total, setQty, remove, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", description: "" });
  const [hp, setHp] = useState(""); // honeypot anti-spam
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");

  function validate(): boolean {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Ingresa tu nombre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Ingresa un correo válido.";
    if (!/^\+?56?9\d{8}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Formato: +569XXXXXXXX.";
    if (!consent) e.consent = "Debes aceptar la política de datos.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;
    setSending(true);
    try {
      const res = await fetch("/api/cotizacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          direccion: hp,
          items: items.map((i) => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
        }),
      });
      if (!res.ok) throw new Error("No se pudo enviar.");
      trackLead(total);
      clear();
      router.push("/gracias");
    } catch {
      setServerError("Ocurrió un problema al enviar. Intenta de nuevo o escríbenos por WhatsApp.");
      setSending(false);
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

  const inputCls =
    "mt-1 w-full rounded-lg border border-linea bg-white px-3 py-2 outline-none focus:border-dorado";

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      {/* Items */}
      <div>
        <ul className="divide-y divide-linea">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-4">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-arena">
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
          <span className="text-tinta-70">Total estimado</span>
          <span className="font-display text-2xl">{formatCLP(total)}</span>
        </div>
      </div>

      {/* Formulario de cotización */}
      <div className="rounded-2xl bg-arena p-6">
        <h2 className="font-display text-2xl">Solicita tu cotización</h2>
        <p className="mt-1 text-sm text-tinta-70">
          Déjanos tus datos y te contactamos para coordinar pago y envío.
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
          <input
            type="text"
            name="direccion"
            tabIndex={-1}
            autoComplete="off"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            style={{ display: "none" }}
            aria-hidden
          />
          <div>
            <label className="text-sm" htmlFor="name">Nombre</label>
            <input id="name" className={inputCls} value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label className="text-sm" htmlFor="email">Correo</label>
            <input id="email" type="email" className={inputCls} value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="text-sm" htmlFor="phone">Teléfono (+569XXXXXXXX)</label>
            <input id="phone" className={inputCls} placeholder="+56912345678" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
          </div>
          <div>
            <label className="text-sm" htmlFor="desc">Mensaje (opcional)</label>
            <textarea id="desc" rows={3} className={inputCls} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <label className="flex items-start gap-2 text-xs text-tinta-70">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
            <span>
              Acepto que RÖA use mis datos para responder esta cotización, según su{" "}
              <Link href="/privacidad" className="underline">política de privacidad</Link> (Ley 21.719).
            </span>
          </label>
          {errors.consent && <p className="text-xs text-red-600">{errors.consent}</p>}

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <button type="submit" disabled={sending} className="btn-dorado w-full disabled:opacity-60">
            {sending ? "Enviando..." : "Enviar cotización"}
          </button>
        </form>
      </div>
    </div>
  );
}
