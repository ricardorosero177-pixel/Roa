"use client";

import { useState } from "react";
import { useCart } from "./cart/CartContext";
import type { Product } from "@/lib/types";

export function AddToCartButton({
  product,
  className = "btn-dorado w-full",
}: {
  product: Product;
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        add(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      aria-label={`Agregar ${product.name} al carrito`}
    >
      {added ? "¡Agregado!" : "Agregar al carrito"}
    </button>
  );
}
