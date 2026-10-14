import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCLP } from "@/lib/format";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card-hover flex flex-col overflow-hidden rounded-2xl border border-linea bg-white">
      <Link href={`/producto/${product.slug}`} className="relative block aspect-square overflow-hidden bg-arena">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/producto/${product.slug}`}>
          <h3 className="text-sm font-medium leading-snug hover:text-dorado">{product.name}</h3>
        </Link>
        <p className="mt-1 text-xs text-tinta-70">{product.shortDescription}</p>
        <p className="mt-3 font-display text-lg">{formatCLP(product.price)}</p>
        <div className="mt-3">
          <AddToCartButton product={product} className="btn-dorado w-full text-sm" />
        </div>
      </div>
    </div>
  );
}
