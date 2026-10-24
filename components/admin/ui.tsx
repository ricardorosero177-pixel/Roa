// Piezas visuales compartidas por las páginas del panel.

export const inputClass =
  "mt-1 w-full rounded-lg border border-linea bg-white px-3 py-2 outline-none focus:border-dorado";

export type PanelSearchParams = Promise<{ ok?: string; error?: string }>;

/** Mensaje de resultado que dejan las acciones en la URL (?ok=… / ?error=…). */
export async function Flash({ searchParams }: { searchParams: PanelSearchParams }) {
  const { ok, error } = await searchParams;
  if (error) {
    return (
      <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
        {error}
      </p>
    );
  }
  if (ok) {
    return (
      <p role="status" className="mt-6 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
        ✓ {ok}
      </p>
    );
  }
  return null;
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-tinta-50">{hint}</span>}
    </label>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-linea bg-white p-5 ${className}`}>{children}</div>;
}
