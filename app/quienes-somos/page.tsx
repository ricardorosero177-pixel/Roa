import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "RÖA Home & Style nace del amor por los espacios que se sienten bien. Decoración minimalista, cálida y atemporal, hecha con intención.",
  alternates: { canonical: "/quienes-somos" },
};

export default async function QuienesSomosPage() {
  const imgs = await getFeaturedProducts(2);

  return (
    <div>
      <section className="bg-arena">
        <div className="container-roa py-16 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-dorado">Nuestra historia</p>
          <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl leading-tight">
            Más que decoración, una forma de vivir
          </h1>
        </div>
      </section>

      <section className="container-roa grid items-center gap-10 py-16 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
          <Image src={imgs[0]?.image ?? ""} alt="RÖA" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="space-y-5 text-lg text-tinta-70">
          <p>
            <strong className="text-tinta">{site.legalName}</strong> nace del amor por los espacios
            que se sienten bien. De esos lugares que transmiten calma, que invitan a detenerse y a
            disfrutar los pequeños momentos del día.
          </p>
          <p>
            Creemos que un hogar no se construye solo con muebles, sino con detalles: objetos que
            cuentan historias, aromas que despiertan emociones y piezas que reflejan quién eres. Cada
            producto que encuentras aquí ha sido elegido con intención, pensando en crear ambientes
            que abracen, inspiren y acompañen.
          </p>
          <p>
            RÖA es una invitación a vivir tu hogar con más consciencia, a rodearte de belleza simple
            y a transformar lo cotidiano en algo especial. No seguimos tendencias pasajeras; buscamos
            equilibrio, armonía y estilo atemporal.
          </p>
          <p>
            Porque creemos que cuando un espacio está en sintonía contigo, todo fluye mejor. Y eso,
            más que decoración, es una forma de vivir.
          </p>
        </div>
      </section>

      <section className="bg-arena">
        <div className="container-roa grid gap-8 py-16 md:grid-cols-3">
          {[
            ["Belleza simple", "Diseños que calman, sin recargar."],
            ["Elegidos con intención", "Cada pieza tiene un porqué."],
            ["Estilo atemporal", "Objetos que perduran, no que pasan de moda."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl bg-white p-8">
              <h2 className="font-display text-xl">{t}</h2>
              <p className="mt-2 text-tinta-70">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-roa py-16 text-center">
        <Link href="/tienda" className="btn-dorado">Descubre nuestras piezas</Link>
      </section>
    </div>
  );
}
