import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { login } from "../actions";
import { SubmitButton } from "@/components/admin/FormButtons";
import { Flash, type PanelSearchParams } from "@/components/admin/ui";

export const metadata: Metadata = {
  title: "Panel RÖA",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: { searchParams: PanelSearchParams }) {
  if (await isAdmin()) redirect("/admin");
  const passwordSet = Boolean(process.env.ADMIN_PASSWORD);

  return (
    <div className="container-roa flex min-h-[60vh] items-center justify-center py-16">
      <form action={login} className="w-full max-w-sm rounded-2xl border border-linea bg-white p-8">
        <h1 className="font-display text-2xl">Panel RÖA</h1>
        <p className="mt-1 text-sm text-tinta-70">Ingresa la contraseña para administrar la tienda.</p>
        {!passwordSet && (
          <p className="mt-3 rounded bg-arena p-2 text-xs text-tinta-70">
            Falta definir <code>ADMIN_PASSWORD</code> en las variables de entorno.
          </p>
        )}
        <Flash searchParams={searchParams} />
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Contraseña"
          required
          className="mt-4 w-full rounded-lg border border-linea px-3 py-2 outline-none focus:border-dorado"
        />
        <SubmitButton className="btn-dorado mt-4 w-full" pendingLabel="Entrando…">
          Entrar
        </SubmitButton>
      </form>
    </div>
  );
}
