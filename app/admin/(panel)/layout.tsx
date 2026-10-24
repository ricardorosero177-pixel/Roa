import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/supabase";
import { logout } from "../actions";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Panel RÖA",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="container-roa py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin" className="font-display text-3xl">Panel RÖA</Link>
        <form action={logout}>
          <button className="btn-ghost text-sm">Salir</button>
        </form>
      </div>

      <AdminNav />

      {!isSupabaseConfigured() && (
        <p className="mt-6 rounded-lg border border-dorado-soft bg-arena p-4 text-sm text-tinta-70">
          <strong className="text-tinta">Falta conectar la base de datos (Supabase).</strong> Puedes
          mirar todo, pero los cambios no se pueden guardar y los pedidos y cotizaciones no quedan
          registrados hasta conectarla.
        </p>
      )}

      {children}
    </div>
  );
}
