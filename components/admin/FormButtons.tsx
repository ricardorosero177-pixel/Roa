"use client";

import { useFormStatus } from "react-dom";

/** Botón de envío que se desactiva mientras se guarda. */
export function SubmitButton({
  children,
  className = "btn-dorado",
  pendingLabel = "Guardando…",
}: {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${className} disabled:opacity-60`}>
      {pending ? pendingLabel : children}
    </button>
  );
}

/** Botón para eliminar que pide confirmación antes de enviar el formulario. */
export function ConfirmButton({
  children,
  message,
  className = "text-sm text-red-700 hover:underline",
}: {
  children: React.ReactNode;
  message: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} disabled:opacity-60`}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {pending ? "Eliminando…" : children}
    </button>
  );
}
