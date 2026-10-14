import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "¡Cotización enviada!",
  description: "Gracias por tu solicitud. Pronto nos pondremos en contacto contigo.",
  robots: { index: false, follow: false },
};

export default function GraciasPage() {
  return (
    <div className="container-roa flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dorado text-3xl text-white">
        ✓
      </div>
      <h1 className="mt-6 font-display text-3xl">¡Cotización enviada!</h1>
      <p className="mt-3 max-w-md text-tinta-70">
        Gracias por escribirnos. RÖA se pondrá en contacto contigo muy pronto para coordinar los
        detalles de tu pedido.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/tienda" className="btn-dorado">Seguir viendo</Link>
        <Link href="/" className="btn-ghost">Volver al inicio</Link>
      </div>
    </div>
  );
}
