"use client";

import { useRef, useState } from "react";

const MAX_SIDE = 1600;

/**
 * Achica la foto en el navegador (máx. 1600 px, JPEG) antes de subirla:
 * las fotos del celular pesan varios MB y el servidor acepta hasta ~4 MB.
 * Si el navegador no puede leerla, se sube tal cual.
 */
async function shrink(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#ffffff"; // fondo blanco para PNG con transparencia
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export function ImageInput({
  name,
  urlName,
  defaultUrl = "",
  label = "Foto",
}: {
  name: string;
  urlName: string;
  defaultUrl?: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(defaultUrl);
  const [busy, setBusy] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const original = e.target.files?.[0];
    if (!original) return;
    setBusy(true);
    const file = await shrink(original);
    const dt = new DataTransfer();
    dt.items.add(file);
    if (inputRef.current) inputRef.current.files = dt.files;
    setPreview(URL.createObjectURL(file));
    setBusy(false);
  }

  return (
    <div>
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-2 flex items-center gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-linea bg-arena">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:)
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-tinta-50">
              Sin foto
            </span>
          )}
        </div>
        <label className="btn-ghost cursor-pointer text-sm">
          {busy ? "Preparando…" : preview ? "Cambiar foto" : "Elegir foto"}
          <input
            ref={inputRef}
            type="file"
            name={name}
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={onChange}
          />
        </label>
      </div>
      <input type="hidden" name={urlName} value={defaultUrl} />
    </div>
  );
}
