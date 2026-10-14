"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import { formatCLP } from "@/lib/format";

export function CartDrawer() {
  const { items, total, isOpen, close, remove, setQty } = useCart();

  return (
    <>
      <div
        aria-hidden={!isOpen}
        onClick={close}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Carrito de compras"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-linea px-5 py-4">
          <h2 className="font-display text-xl">Tu carrito</h2>
          <button onClick={close} aria-label="Cerrar carrito" className="text-2xl leading-none">
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-tinta-70">
              Tu carrito está vacío.
              <br />
              <Link href="/tienda" onClick={close} className="mt-4 inline-block underline">
                Ver la tienda
              </Link>
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-arena">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-tight">{item.name}</p>
                    <p className="text-sm text-dorado">{formatCLP(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => setQty(item.id, item.qty - 1)}
                        className="h-7 w-7 rounded-full border border-linea"
                        aria-label="Quitar uno"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{item.qty}</span>
                      <button
                        onClick={() => setQty(item.id, item.qty + 1)}
                        className="h-7 w-7 rounded-full border border-linea"
                        aria-label="Agregar uno"
                      >
                        +
                      </button>
                      <button
                        onClick={() => remove(item.id)}
                        className="ml-auto text-xs text-tinta-70 underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-linea px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-tinta-70">Total</span>
              <span className="font-display text-xl">{formatCLP(total)}</span>
            </div>
            <Link href="/carrito" onClick={close} className="btn-dorado w-full">
              Solicitar cotización
            </Link>
            <p className="mt-2 text-center text-xs text-tinta-70">
              Te contactamos para coordinar pago y envío.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
