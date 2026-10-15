import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Tu carrito",
  description: "Revisa tu selección y paga de forma segura con MercadoPago en RÖA.",
  robots: { index: false, follow: true },
};

export default async function CarritoPage({
  searchParams,
}: {
  searchParams: Promise<{ pago?: string }>;
}) {
  const { pago } = await searchParams;

  return (
    <div className="container-roa py-12">
      <h1 className="font-display text-4xl">Tu carrito</h1>
      <p className="mt-2 text-tinta-70">Revisa tu selección y finaliza tu compra.</p>

      {pago === "error" && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          El pago no se completó o fue cancelado. Puedes intentarlo de nuevo o escribirnos por WhatsApp.
        </div>
      )}

      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}
