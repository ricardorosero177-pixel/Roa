import type { Review } from "./types";
import { getSupabase } from "./supabase";

// Reseñas reales de clientas. Con Supabase configurado se leen de la tabla
// `reviews` (editables desde /admin); sin Supabase, se usa esta lista.
export const reviews: Review[] = [
  {
    name: "Camila Rojas",
    text: "Tuve dudas al principio pero todo salió bien. Me escribieron para coordinar y la entrega fue sin problema, lo recomiendo.",
    rating: 5,
  },
  {
    name: "Evelyn",
    text: "Muy buena, me llegaron y hermosos los productos.",
    rating: 5,
  },
  {
    name: "Javiera Sandoval",
    text: "Me encantó el de corazón, se ve muy hermoso en mi pieza. ¡Me encanta!",
    rating: 5,
  },
  {
    name: "Kendris Grijalva",
    text: "Me encantó el florero 😍 es tal cual como en la foto, súper lindo. Le dio un toque muy bonito a mi espacio. ¡Lo recomiendo!",
    rating: 5,
  },
];

/** Todas las reseñas, incluidas las ocultas (para el panel). */
export async function getAllReviews(): Promise<Review[]> {
  const supabase = getSupabase();
  if (!supabase) return reviews.map((r, i) => ({ ...r, id: i + 1, visible: true }));
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });
  if (error) {
    console.error("[resenas] error al listar:", error.message);
    return reviews;
  }
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    text: r.text,
    rating: r.rating,
    visible: r.visible,
  }));
}

/** Reseñas visibles en la página de inicio. */
export async function getReviews(): Promise<Review[]> {
  return (await getAllReviews()).filter((r) => r.visible !== false);
}
