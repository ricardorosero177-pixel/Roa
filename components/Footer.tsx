import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 bg-arena text-tinta">
      <div className="container-roa grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl">{site.name}</p>
          <p className="mt-3 max-w-xs text-sm text-tinta-70">
            Pequeños detalles que transforman tu espacio. Decoración minimalista, cálida y atemporal.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">Tienda</h3>
          <ul className="space-y-2 text-sm text-tinta-70">
            <li><Link href="/tienda" className="hover:text-dorado">Todos los productos</Link></li>
            <li><Link href="/categoria/hogar-y-decoracion" className="hover:text-dorado">Hogar y decoración</Link></li>
            <li><Link href="/categoria/detalles-accesorios" className="hover:text-dorado">Detalles y accesorios</Link></li>
            <li><Link href="/blog" className="hover:text-dorado">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">Información</h3>
          <ul className="space-y-2 text-sm text-tinta-70">
            <li><Link href="/quienes-somos" className="hover:text-dorado">Quiénes somos</Link></li>
            <li><Link href="/politicas-devolucion" className="hover:text-dorado">Política de devoluciones</Link></li>
            <li><Link href="/privacidad" className="hover:text-dorado">Privacidad y datos</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">Contacto</h3>
          <ul className="space-y-2 text-sm text-tinta-70">
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
        <div className="container-roa flex flex-col items-center justify-between gap-2 py-5 text-xs text-tinta-70 md:flex-row">
          <p>© {year} {site.legalName}. Todos los derechos reservados.</p>
          <p>Hecho con cariño en Chile 🇨🇱</p>
        </div>
      </div>
    </footer>
  );
}
