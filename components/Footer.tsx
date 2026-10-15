import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-linea bg-arena-100 text-tinta">
      <div className="container-roa grid gap-10 py-16 md:grid-cols-4">
        <div>
          <Logo withTagline tone="dark" className="text-[2rem]" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-tinta-70">
            Pequeños detalles que transforman tu espacio. Decoración minimalista, cálida y atemporal.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-tinta-50">Tienda</h3>
          <ul className="space-y-2.5 text-sm text-tinta-70">
            <li><Link href="/tienda" className="hover:text-dorado">Todos los productos</Link></li>
            <li><Link href="/categoria/hogar-y-decoracion" className="hover:text-dorado">Hogar & Decoración</Link></li>
            <li><Link href="/categoria/aromas-sensaciones" className="hover:text-dorado">Aromas & Sensaciones</Link></li>
            <li><Link href="/blog" className="hover:text-dorado">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-tinta-50">Información</h3>
          <ul className="space-y-2.5 text-sm text-tinta-70">
            <li><Link href="/quienes-somos" className="hover:text-dorado">Quiénes somos</Link></li>
            <li><Link href="/politicas-devolucion" className="hover:text-dorado">Política de devoluciones</Link></li>
            <li><Link href="/privacidad" className="hover:text-dorado">Privacidad y datos</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-tinta-50">Contacto</h3>
          <ul className="space-y-2.5 text-sm text-tinta-70">
            <li>
              <a href={`mailto:${site.contact.email}`} className="hover:text-dorado">
                {site.contact.email}
              </a>
            </li>
            <li>
              <a href={whatsappLink()} className="hover:text-dorado" target="_blank" rel="noopener">
                WhatsApp {site.contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={site.contact.instagramUrl} className="hover:text-dorado" target="_blank" rel="noopener">
                Instagram @{site.contact.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-linea">
        <div className="container-roa flex flex-col items-center justify-between gap-2 py-6 text-xs text-tinta-50 md:flex-row">
          <p>© {year} {site.legalName}. Todos los derechos reservados.</p>
          <p>Hecho con cariño en Chile 🇨🇱</p>
        </div>
      </div>
    </footer>
  );
}
