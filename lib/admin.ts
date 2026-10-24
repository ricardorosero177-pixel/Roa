import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "./auth";
import { getSupabase } from "./supabase";

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

/**
 * Corta el paso si no hay sesión de administradora. Se llama en cada página
 * del panel Y en cada Server Action: las acciones son endpoints públicos y
 * el layout por sí solo no las protege.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

/** "Florero Grande Nórdico" → "florero-grande-nordico" */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/**
 * Sube una foto al bucket público `imagenes` de Supabase y devuelve su URL.
 * Devuelve null si no se eligió archivo; lanza Error con un mensaje para la
 * administradora si el archivo no sirve o la subida falla.
 */
export async function uploadImage(file: FormDataEntryValue | null, folder: string) {
  if (!(file instanceof File) || file.size === 0) return null;
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new Error("La foto debe ser JPG, PNG o WebP.");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("La foto pesa más de 5 MB.");

  const supabase = getSupabase();
  if (!supabase) throw new Error("Conecta la base de datos para subir fotos.");

  const name = `${folder}/${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
  const { error } = await supabase.storage
    .from("imagenes")
    .upload(name, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) throw new Error(`No se pudo subir la foto: ${error.message}`);
  return supabase.storage.from("imagenes").getPublicUrl(name).data.publicUrl;
}
