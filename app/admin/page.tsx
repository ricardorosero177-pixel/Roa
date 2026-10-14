import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { listQuotes } from "@/lib/quotes";
import { isSupabaseConfigured } from "@/lib/supabase";
import { formatCLP } from "@/lib/format";

export const metadata: Metadata = {
  title: "Panel RÖA",
  robots: { index: false, follow: false },
};

const COOKIE = "roa_admin";

async function login(formData: FormData) {
  "use server";
  const pass = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (expected && pass === expected) {
    const jar = await cookies();
    jar.set(COOKIE, "ok", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
  }
  redirect("/admin");
}

async function logout() {
  "use server";
  const jar = await cookies();
  jar.delete(COOKIE);
  redirect("/admin");
}

export default async function AdminPage() {
  const jar = await cookies();
  const authed = jar.get(COOKIE)?.value === "ok";
  const passwordSet = Boolean(process.env.ADMIN_PASSWORD);

  if (!authed) {
    return (
      <div className="container-roa flex min-h-[60vh] items-center justify-center py-16">
        <form action={login} className="w-full max-w-sm rounded-2xl border border-linea p-8">
          <h1 className="font-display text-2xl">Panel RÖA</h1>
          <p className="mt-1 text-sm text-tinta-70">Ingresa la contraseña para ver las cotizaciones.</p>
          {!passwordSet && (
            <p className="mt-3 rounded bg-arena p-2 text-xs text-tinta-70">
              Falta definir <code>ADMIN_PASSWORD</code> en las variables de entorno.
            </p>
          )}
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            className="mt-4 w-full rounded-lg border border-linea px-3 py-2 outline-none focus:border-dorado"
          />
          <button type="submit" className="btn-dorado mt-4 w-full">Entrar</button>
        </form>
      </div>
    );
  }

  const quotes = await listQuotes();

  return (
    <div className="container-roa py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Cotizaciones</h1>
        <form action={logout}>
          <button className="btn-ghost text-sm">Salir</button>
        </form>
      </div>

      {!isSupabaseConfigured() && (
        <p className="mt-4 rounded-lg bg-arena p-4 text-sm text-tinta-70">
          Supabase no está configurado todavía. Conecta tu base de datos para guardar y listar las
          cotizaciones. Mientras tanto, las solicitudes quedan registradas en el log del servidor.
        </p>
      )}

      {isSupabaseConfigured() && quotes.length === 0 && (
        <p className="mt-6 text-tinta-70">Aún no hay cotizaciones.</p>
      )}

      <div className="mt-6 space-y-4">
        {quotes.map((q) => {
          const total = (q.items ?? []).reduce((n, it) => n + it.price * it.qty, 0);
          return (
            <div key={q.id} className="rounded-2xl border border-linea p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{q.name}</p>
                  <p className="text-sm text-tinta-70">{q.email} · {q.phone}</p>
                </div>
                <p className="text-sm text-tinta-70">
                  {q.createdAt ? new Date(q.createdAt).toLocaleString("es-CL") : ""}
                </p>
              </div>
              {q.description && <p className="mt-3 text-sm">{q.description}</p>}
              {(q.items ?? []).length > 0 && (
                <ul className="mt-3 border-t border-linea pt-3 text-sm text-tinta-70">
                  {q.items!.map((it) => (
                    <li key={it.id} className="flex justify-between">
                      <span>{it.qty} × {it.name}</span>
                      <span>{formatCLP(it.price * it.qty)}</span>
                    </li>
                  ))}
                  <li className="mt-1 flex justify-between font-medium text-tinta">
                    <span>Total</span>
                    <span>{formatCLP(total)}</span>
                  </li>
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
