import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCLP } from "@/lib/format";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col">
      <div className="img-zoom relative aspect-[4/5] overflow-hidden rounded-xl bg-white">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />
        <Link href={`/producto/${product.slug}`} aria-label={product.name} className="absolute inset-0" />
        {/* Agregar al carrito (aparece al pasar el cursor, solo escritorio) */}
        <div className="absolute inset-x-0 bottom-0 z-10 hidden translate-y-full p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block">
          <AddToCartButton product={product} className="btn-dorado w-full text-sm" />
        </div>
      </div>

      <div className="mt-3">
        <Link href={`/producto/${product.slug}`}>
          <h3 className="text-sm leading-snug text-tinta transition-colors group-hover:text-dorado">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 font-display text-base text-tinta">{formatCLP(product.price)}</p>
        {/* En celular: botón sobrio bajo el precio */}
        <div className="mt-2 md:hidden">
          <AddToCartButton product={product} className="btn-ghost w-full text-xs" />
        </div>
      </div>
    </div>
  );
}
