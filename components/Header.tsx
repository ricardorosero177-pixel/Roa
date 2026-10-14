"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";
import { useCart } from "./cart/CartContext";

export function Header() {
  const { count, open } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-linea bg-arena/90 backdrop-blur">
      <div className="container-roa flex h-16 items-center justify-between">
        <button
          className="md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span className="block h-0.5 w-6 bg-tinta" />
          <span className="mt-1.5 block h-0.5 w-6 bg-tinta" />
          <span className="mt-1.5 block h-0.5 w-6 bg-tinta" />
        </button>

        <Link href="/" className="font-display text-2xl tracking-wide" aria-label="RÖA inicio">
          {site.name}
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors hover:text-dorado ${
                  active ? "text-dorado" : "text-tinta"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={open}
          className="relative flex items-center gap-2 text-sm"
          aria-label={`Abrir carrito, ${count} productos`}
        >
          <span aria-hidden>🛍️</span>
          <span className="hidden sm:inline">Carrito</span>
          {count > 0 && (
            <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-dorado text-xs text-white">
              {count}
            </span>
          )}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-linea bg-arena md:hidden" aria-label="Móvil">
          <ul className="container-roa flex flex-col py-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-tinta"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
