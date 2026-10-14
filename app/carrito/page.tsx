import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Tu carrito",
  description: "Revisa tu selección y solicita una cotización personalizada a RÖA.",
  robots: { index: false, follow: true },
};

export default function CarritoPage() {
  return (
    <div className="container-roa py-12">
      <h1 className="font-display text-4xl">Tu carrito</h1>
      <p className="mt-2 text-tinta-70">Revisa tu selección y solicita tu cotización.</p>
      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}
