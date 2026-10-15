import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad y datos",
  description:
    "Cómo RÖA recopila, usa y protege tus datos personales, conforme a la Ley 21.719 de protección de datos de Chile.",
  alternates: { canonical: "/privacidad" },
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  return (
    <div className="container-roa max-w-3xl py-12">
      <h1 className="font-display text-4xl">Política de privacidad</h1>
      <p className="mt-3 text-tinta-70">
        Última actualización: {new Date().toLocaleDateString("es-CL")}. En {site.legalName}{" "}
        respetamos tu privacidad y tratamos tus datos conforme a la Ley 21.719 sobre protección de
        datos personales.
      </p>

      <div className="mt-8 space-y-6 text-tinta-70">
        <section>
          <h2 className="font-display text-xl text-tinta">Responsable del tratamiento</h2>
          <p className="mt-2">
            {site.legalName}, con contacto en {site.contact.email}, es responsable del tratamiento de
            los datos que nos entregas.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-tinta">Qué datos recopilamos</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Datos que entregas al comprar o contactarnos: nombre, correo y teléfono.</li>
            <li>El detalle de tu consulta o los productos de tu carrito.</li>
            <li>Datos de navegación y cookies, solo si aceptas (analítica y publicidad).</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-tinta">Para qué los usamos</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Procesar tus compras y coordinar la entrega.</li>
            <li>Mejorar nuestra tienda y medir nuestras campañas (con tu consentimiento).</li>
            <li>Enviarte información de productos solo si lo autorizas.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-tinta">Cookies y publicidad</h2>
          <p className="mt-2">
            Usamos cookies propias y de terceros (Google y Meta) para medir y personalizar la
            publicidad. Puedes aceptarlas o rechazarlas en el aviso de cookies. Si rechazas, no se
            cargan los rastreadores de marketing.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-tinta">Tus derechos</h2>
          <p className="mt-2">
            Puedes solicitar acceso, rectificación, eliminación u oposición al tratamiento de tus
            datos escribiéndonos a {site.contact.email}. Responderemos en los plazos que establece la
            ley.
          </p>
        </section>
      </div>
    </div>
  );
}
