"use client";

import { useRouter } from "next/navigation";
import { useCart } from "./cart/CartContext";
import { trackAddToCart } from "@/lib/track";
import type { Product } from "@/lib/types";

export function AddToCartButton({
  product,
  className = "btn-dorado w-full",
  iconOnly = false,
}: {
  product: Product;
  className?: string;
  iconOnly?: boolean;
}) {
  const { add } = useCart();
  const router = useRouter();

  function handleAdd() {
    add(product);
    trackAddToCart(product);
    router.push("/carrito");
  }

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Agregar ${product.name} al carrito`}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-tinta shadow-md transition-all hover:bg-dorado hover:text-white"
      >
        +
      </button>
    );
  }

  return (
    <button type="button" className={className} onClick={handleAdd} aria-label={`Agregar ${product.name} al carrito`}>
      Agregar al carrito
    </button>
  );
}
