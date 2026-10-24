"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, createSessionToken, verifyPassword } from "@/lib/auth";
import { requireAdmin, slugify, uploadImage } from "@/lib/admin";
import { getSupabase } from "@/lib/supabase";
import { categories } from "@/lib/catalog";
import { adminHintCookie } from "@/lib/site";
import { fulfillmentSteps, updateOrderFulfillment, type Fulfillment } from "@/lib/orders";

// Todas las acciones vuelven a la página con ?ok=... o ?error=... para mostrar
// el resultado. redirect() funciona lanzando una excepción, así que nunca va
// dentro de un try/catch.

function back(path: string, kind: "ok" | "error", message: string): never {
  redirect(`${path}?${kind}=${encodeURIComponent(message)}`);
}

const text = (fd: FormData, key: string, max = 500) =>
  String(fd.get(key) ?? "").trim().slice(0, max);
const int = (fd: FormData, key: string) => Math.max(0, Math.floor(Number(fd.get(key)) || 0));
const bool = (fd: FormData, key: string) => fd.get(key) === "on";

/** La tienda pública lee estos datos: tras cada cambio se regeneran sus páginas. */
function refreshStore() {
  revalidatePath("/", "layout");
}

function db(path: string) {
  const supabase = getSupabase();
  if (!supabase) back(path, "error", "Primero hay que conectar la base de datos (Supabase).");
  return supabase;
}

// ---------- Sesión ----------

export async function login(formData: FormData) {
  if (!verifyPassword(String(formData.get("password") ?? ""))) {
    back("/admin/login", "error", "Contraseña incorrecta.");
  }
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionToken(8), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  jar.set(adminHintCookie, "1", {
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect("/admin");
}

export async function logout() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete(adminHintCookie);
  redirect("/admin/login");
}

// ---------- Productos ----------

export async function saveProduct(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id")) || null;
  const formPath = id ? `/admin/productos/${id}` : "/admin/productos/nuevo";
  const supabase = db(formPath);

  const name = text(formData, "name", 160);
  const slug = slugify(text(formData, "slug", 160) || name);
  const price = int(formData, "price");
  const categorySlug = text(formData, "category", 80);
  if (!name) back(formPath, "error", "Falta el nombre del producto.");
  if (!slug) back(formPath, "error", "El nombre debe tener letras o números.");
  if (price <= 0) back(formPath, "error", "El precio debe ser mayor a 0.");
  if (!categories.some((c) => c.slug === categorySlug)) {
    back(formPath, "error", "Elige una categoría.");
  }

  let image = text(formData, "image_url", 1000);
  try {
    image = (await uploadImage(formData.get("image_file"), "productos")) ?? image;
  } catch (e) {
    back(formPath, "error", (e as Error).message);
  }
  if (!image) back(formPath, "error", "Agrega una foto del producto.");

  const row = {
    name,
    slug,
    price,
    image,
    category_slug: categorySlug,
    short_description: text(formData, "short_description", 300),
    description: text(formData, "description", 4000),
    stock: int(formData, "stock"),
    featured: bool(formData, "featured"),
    active: bool(formData, "active"),
  };
  const { error } = id
    ? await supabase.from("products").update(row).eq("id", id)
    : await supabase.from("products").insert(row);
  if (error) {
    back(
      formPath,
      "error",
      error.code === "23505"
        ? "Ya existe otro producto con esa dirección web. Cambia el nombre o la dirección."
        : `No se pudo guardar: ${error.message}`,
    );
  }

  refreshStore();
  back("/admin/productos", "ok", id ? `Guardaste "${name}".` : `Agregaste "${name}" a la tienda.`);
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const supabase = db("/admin/productos");
  const id = Number(formData.get("id"));
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) back("/admin/productos", "error", `No se pudo eliminar: ${error.message}`);
  refreshStore();
  back("/admin/productos", "ok", "Producto eliminado.");
}

// ---------- Pedidos y cotizaciones ----------

export async function updateOrder(formData: FormData) {
  await requireAdmin();
  db("/admin/pedidos");
  const mpPaymentId = text(formData, "mp_payment_id", 60);
  const fulfillment = text(formData, "fulfillment", 20) as Fulfillment;
  if (!fulfillmentSteps.includes(fulfillment)) back("/admin/pedidos", "error", "Estado no válido.");
  const ok = await updateOrderFulfillment(mpPaymentId, fulfillment, text(formData, "notes", 1000));
  if (!ok) back("/admin/pedidos", "error", "No se pudo actualizar el pedido.");
  revalidatePath("/admin", "layout");
  back("/admin/pedidos", "ok", `Pedido #${mpPaymentId} actualizado.`);
}

export async function deleteQuote(formData: FormData) {
  await requireAdmin();
  const supabase = db("/admin/cotizaciones");
  const { error } = await supabase.from("quotes").delete().eq("id", text(formData, "id", 60));
  if (error) back("/admin/cotizaciones", "error", `No se pudo eliminar: ${error.message}`);
  revalidatePath("/admin", "layout");
  back("/admin/cotizaciones", "ok", "Cotización eliminada.");
}

// ---------- Blog ----------

export async function savePost(formData: FormData) {
  await requireAdmin();
  const originalSlug = text(formData, "original_slug", 160);
  const formPath = originalSlug ? `/admin/blog/${originalSlug}` : "/admin/blog/nuevo";
  const supabase = db(formPath);

  const title = text(formData, "title", 200);
  const slug = slugify(text(formData, "slug", 160) || title);
  const content = text(formData, "content", 50000);
  if (!title) back(formPath, "error", "Falta el título.");
  if (!slug) back(formPath, "error", "El título debe tener letras o números.");
  if (!content) back(formPath, "error", "Escribe el contenido del artículo.");

  let cover = text(formData, "cover_url", 1000);
  try {
    cover = (await uploadImage(formData.get("cover_file"), "blog")) ?? cover;
  } catch (e) {
    back(formPath, "error", (e as Error).message);
  }
  if (!cover) back(formPath, "error", "Agrega una foto de portada.");

  const words = content.split(/\s+/).filter(Boolean).length;
  const row = {
    slug,
    title,
    excerpt: text(formData, "excerpt", 400),
    category: text(formData, "category", 60),
    date: text(formData, "date", 10) || new Date().toISOString().slice(0, 10),
    cover,
    content,
    reading_minutes: Math.max(1, Math.round(words / 200)),
    published: bool(formData, "published"),
  };
  const { error } = originalSlug
    ? await supabase.from("posts").update(row).eq("slug", originalSlug)
    : await supabase.from("posts").insert(row);
  if (error) {
    back(
      formPath,
      "error",
      error.code === "23505"
        ? "Ya existe otro artículo con esa dirección web. Cambia el título o la dirección."
        : `No se pudo guardar: ${error.message}`,
    );
  }

  refreshStore();
  back("/admin/blog", "ok", originalSlug ? `Guardaste "${title}".` : `Creaste "${title}".`);
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  const supabase = db("/admin/blog");
  const { error } = await supabase.from("posts").delete().eq("slug", text(formData, "slug", 160));
  if (error) back("/admin/blog", "error", `No se pudo eliminar: ${error.message}`);
  refreshStore();
  back("/admin/blog", "ok", "Artículo eliminado.");
}

// ---------- Reseñas ----------

export async function saveReview(formData: FormData) {
  await requireAdmin();
  const supabase = db("/admin/resenas");
  const id = Number(formData.get("id")) || null;
  const name = text(formData, "name", 80);
  const body = text(formData, "text", 600);
  if (!name || !body) back("/admin/resenas", "error", "La reseña necesita nombre y texto.");

  const row = {
    name,
    text: body,
    rating: Math.min(5, Math.max(1, int(formData, "rating") || 5)),
    visible: bool(formData, "visible"),
  };
  const { error } = id
    ? await supabase.from("reviews").update(row).eq("id", id)
    : await supabase.from("reviews").insert(row);
  if (error) back("/admin/resenas", "error", `No se pudo guardar: ${error.message}`);

  refreshStore();
  back("/admin/resenas", "ok", id ? "Reseña guardada." : "Reseña agregada.");
}

export async function deleteReview(formData: FormData) {
  await requireAdmin();
  const supabase = db("/admin/resenas");
  const { error } = await supabase.from("reviews").delete().eq("id", Number(formData.get("id")));
  if (error) back("/admin/resenas", "error", `No se pudo eliminar: ${error.message}`);
  refreshStore();
  back("/admin/resenas", "ok", "Reseña eliminada.");
}
