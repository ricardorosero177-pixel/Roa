import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de devoluciones",
  description:
    "Conoce la política de cambios y devoluciones de RÖA. Tu satisfacción es nuestra prioridad.",
  alternates: { canonical: "/politicas-devolucion" },
};

export default function DevolucionesPage() {
  return (
    <div className="container-roa max-w-3xl py-12">
      <h1 className="font-display text-4xl">Política de devoluciones</h1>
      <p className="mt-3 text-tinta-70">
        En {site.name} queremos que ames lo que recibes. Si algo no resulta como esperabas, te
        ayudamos a resolverlo.
      </p>

      <div className="mt-8 space-y-6 text-tinta-70">
        <section>
          <h2 className="font-display text-xl text-tinta">Derecho a retracto (Ley del Consumidor)</h2>
          <p className="mt-2">
            Según la Ley 19.496, en compras a distancia tienes hasta 10 días corridos desde la
            recepción del producto para retractarte, siempre que el producto esté sin uso y en su
            embalaje original.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-tinta">Productos con falla</h2>
          <p className="mt-2">
            Si tu producto llega dañado o con defecto de fabricación, contáctanos dentro de 7 días
            con una foto del problema. Coordinamos el cambio o la devolución del dinero, según
            prefieras.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-tinta">Cómo solicitar una devolución</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Escríbenos a {site.contact.email} o por WhatsApp {site.contact.phoneDisplay}.</li>
            <li>Indícanos tu número de pedido y el motivo.</li>
            <li>Te damos las instrucciones para el envío de vuelta.</li>
            <li>Una vez recibido y revisado el producto, procesamos el reembolso o cambio.</li>
          </ol>
        </section>

        <section>
          <h2 className="font-display text-xl text-tinta">Costos de envío</h2>
          <p className="mt-2">
            En caso de falla o error nuestro, nosotros cubrimos el envío. En retractos voluntarios,
            el costo de devolución es de cargo del cliente.
          </p>
        </section>
      </div>
    </div>
  );
}
