"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/cotizaciones", label: "Cotizaciones" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/resenas", label: "Reseñas" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="-mx-4 mt-6 overflow-x-auto border-b border-linea px-4" aria-label="Secciones del panel">
      <ul className="flex gap-6 whitespace-nowrap text-sm">
        {links.map((l) => {
          const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`-mb-px block border-b-2 pb-3 transition-colors ${
                  active ? "border-dorado text-tinta" : "border-transparent text-tinta-70 hover:text-dorado"
                }`}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
