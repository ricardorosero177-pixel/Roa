"use client";

import Link from "next/link";
import { useState, useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { nav, adminHintCookie } from "@/lib/site";
import { useCart } from "./cart/CartContext";
import { Logo } from "./Logo";

// Enlace "Panel" solo para quien inició sesión en /admin (ver adminHintCookie).
const noSubscribe = () => () => {};
const hasAdminHint = () =>
  document.cookie.split("; ").some((c) => c === `${adminHintCookie}=1`);

export function Header() {
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isAdmin = useSyncExternalStore(noSubscribe, hasAdminHint, () => false);
  const links = isAdmin ? [...nav, { label: "Panel", href: "/admin" }] : nav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b border-linea bg-arena/90 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-[0_6px_24px_rgba(30,30,28,0.07)]" : ""
      }`}
    >
      <div className="container-roa relative flex h-20 items-center justify-between">
        {/* Menú móvil: desplegable nativo (funciona sin JS) */}
        <details className="group md:hidden">
          <summary
            className="flex cursor-pointer list-none flex-col gap-1.5 p-2 [&::-webkit-details-marker]:hidden"
            aria-label="Abrir menú"
          >
            <span className="block h-0.5 w-6 bg-tinta transition-transform group-open:translate-y-2 group-open:rotate-45" />
            <span className="block h-0.5 w-6 bg-tinta transition-opacity group-open:opacity-0" />
            <span className="block h-0.5 w-6 bg-tinta transition-transform group-open:-translate-y-2 group-open:-rotate-45" />
          </summary>
          <nav
            className="absolute inset-x-0 top-full z-50 border-t border-linea bg-arena shadow-[0_18px_40px_rgba(30,30,28,0.12)]"
            aria-label="Menú"
          >
            <ul className="container-roa flex flex-col py-3">
              {links.map((item) => (
                <li key={item.href} className="border-b border-linea/60 last:border-0">
                  <Link href={item.href} className="block py-3.5 text-base text-tinta">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>

        <Link
          href="/"
          className="md:absolute md:left-1/2 md:-translate-x-1/2"
          aria-label="RÖA inicio"
        >
          <Logo className="text-[1.35rem] md:text-[1.6rem]" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {links.map((item) => {
            const active =
              item.href === "/admin" ? pathname.startsWith("/admin") : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`link-underline text-sm transition-colors hover:text-dorado ${
                  active ? "text-dorado" : "text-tinta"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={open}
          className="relative flex items-center gap-2 p-1 text-sm"
          aria-label={`Abrir carrito, ${count} productos`}
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="20" r="1.3" />
            <circle cx="18" cy="20" r="1.3" />
            <path d="M2.5 3h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.3a1.5 1.5 0 0 0 1.5-1.2L21 6.5H6" />
          </svg>
          <span className="hidden sm:inline">Carrito</span>
          {count > 0 && (
            <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-dorado text-xs text-white">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
