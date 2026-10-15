"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart/CartContext";
import { whatsappLink } from "@/lib/site";
import { trackViewContent, trackAddToCart } from "@/lib/track";
import type { Product } from "@/lib/types";

export function ProductActions({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    trackViewContent(product);
  }, [product]);

  const wsp = whatsappLink(
    `Hola RÖA 👋 Quiero comprar "${product.name}". ¿Me ayudas con el pago y el envío?`,
  );

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-tinta-70">Cantidad</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-9 w-9 rounded-full border border-linea"
            aria-label="Quitar uno"
          >
            −
          </button>
          <span className="w-6 text-center">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="h-9 w-9 rounded-full border border-linea"
            aria-label="Agregar uno"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <a href={wsp} target="_blank" rel="noopener" className="btn-dorado flex-1">
          Comprar por WhatsApp
        </a>
        <button
          type="button"
          className="btn-ghost flex-1"
          onClick={() => {
            add(product, qty);
            trackAddToCart(product);
            router.push("/carrito");
          }}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
