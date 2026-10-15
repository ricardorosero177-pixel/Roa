"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart/CartContext";
import { formatCLP } from "@/lib/format";
import { whatsappLink } from "@/lib/site";

type Form = {
  name: string;
  surname: string;
  email: string;
  whatsapp: string;
  direccion: string;
  comuna: string;
};
type Errors = Partial<Record<keyof Form, string>>;

export function CartView() {
  const { items, total, setQty, remove } = useCart();
  const [paying, setPaying] = useState(false);
  const [serverError, setServerError] = useState("");
  const [form, setForm] = useState<Form>({
    name: "",
    surname: "",
    email: "",
    whatsapp: "",
    direccion: "",
    comuna: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  function validate(): boolean {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Ingresa tu nombre.";
    if (!form.surname.trim()) e.surname = "Ingresa tu apellido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido.";
    if (!/^\+?56?9\d{8}$/.test(form.whatsapp.replace(/\s/g, ""))) e.whatsapp = "Formato: +569XXXXXXXX.";
    if (!form.direccion.trim()) e.direccion = "Ingresa tu dirección.";
    if (!form.comuna.trim()) e.comuna = "Ingresa tu comuna.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function payWithMercadoPago() {
    setServerError("");
    if (!validate()) return;
    setPaying(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
          customer: form,
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

  const inputCls =
    "mt-1 w-full rounded-lg border border-linea bg-white px-3 py-2 outline-none focus:border-dorado";
  const set = (k: keyof Form) => (ev: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: ev.target.value });

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
        <Link href="/tienda" className="btn-ghost mt-5 w-full">
          Seguir comprando
        </Link>
      </div>

      {/* Datos del cliente + pago */}
      <div className="h-fit rounded-2xl border border-linea bg-white p-6">
        <h2 className="font-display text-2xl">Tus datos</h2>
        <p className="mt-1 text-sm text-tinta-70">
          Completa tus datos para coordinar la entrega. Luego vas al pago seguro.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm" htmlFor="name">Nombre</label>
            <input id="name" className={inputCls} value={form.name} onChange={set("name")} />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label className="text-sm" htmlFor="surname">Apellido</label>
            <input id="surname" className={inputCls} value={form.surname} onChange={set("surname")} />
            {errors.surname && <p className="mt-1 text-xs text-red-600">{errors.surname}</p>}
          </div>
          <div className="col-span-2">
            <label className="text-sm" htmlFor="email">Correo</label>
            <input id="email" type="email" className={inputCls} value={form.email} onChange={set("email")} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div className="col-span-2">
            <label className="text-sm" htmlFor="whatsapp">WhatsApp (+569XXXXXXXX)</label>
            <input id="whatsapp" className={inputCls} placeholder="+56912345678" value={form.whatsapp} onChange={set("whatsapp")} />
            {errors.whatsapp && <p className="mt-1 text-xs text-red-600">{errors.whatsapp}</p>}
          </div>
          <div className="col-span-2">
            <label className="text-sm" htmlFor="direccion">Dirección</label>
            <input id="direccion" className={inputCls} placeholder="Calle y número" value={form.direccion} onChange={set("direccion")} />
            {errors.direccion && <p className="mt-1 text-xs text-red-600">{errors.direccion}</p>}
          </div>
          <div className="col-span-2">
            <label className="text-sm" htmlFor="comuna">Comuna</label>
            <input id="comuna" className={inputCls} value={form.comuna} onChange={set("comuna")} />
            {errors.comuna && <p className="mt-1 text-xs text-red-600">{errors.comuna}</p>}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-y border-linea py-3">
          <span className="text-tinta-70">Total</span>
          <span className="font-display text-xl">{formatCLP(total)}</span>
        </div>
        <p className="mt-3 text-sm text-tinta-70">
          Pago seguro con MercadoPago (tarjeta de crédito o débito). Envío gratis en Santiago.
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
