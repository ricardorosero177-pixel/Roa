import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "¡Gracias!",
  description: "Gracias por tu compra o solicitud en RÖA.",
  robots: { index: false, follow: false },
};

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  let title = "¡Gracias!";
  let message =
    "Gracias por visitar RÖA. Si tienes cualquier duda, escríbenos por WhatsApp y te ayudamos.";

  if (status === "approved") {
    title = "¡Pago confirmado!";
    message =
      "Gracias por tu compra 💛 Recibimos tu pago y prepararemos tu pedido con cariño. Te contactaremos para coordinar la entrega.";
  } else if (status === "pending") {
    title = "Pago en proceso";
    message =
      "Tu pago está siendo procesado. Apenas se confirme, prepararemos tu pedido y te avisaremos.";
  }

  return (
    <div className="container-roa flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dorado text-3xl text-white">
        ✓
      </div>
      <h1 className="mt-6 font-display text-3xl">{title}</h1>
      <p className="mt-3 max-w-md text-tinta-70">{message}</p>
      <div className="mt-8 flex gap-3">
        <Link href="/tienda" className="btn-dorado">Seguir viendo</Link>
        <Link href="/" className="btn-ghost">Volver al inicio</Link>
      </div>
    </div>
  );
}
