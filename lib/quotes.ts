import "server-only";
import { getSupabase } from "./supabase";
import type { Quote } from "./types";

export async function createQuote(quote: Quote): Promise<{ ok: boolean; id?: string }> {
  const supabase = getSupabase();
  const row = {
    name: quote.name,
    email: quote.email,
    phone: quote.phone,
    description: quote.description,
    items: quote.items ?? [],
    created_at: new Date().toISOString(),
  };

  if (!supabase) {
    // Sin base de datos configurada: registramos la cotización en el log.
    console.info("[cotizacion] (sin Supabase configurado):", JSON.stringify(row));
    return { ok: true };
  }

  const { data, error } = await supabase
    .from("quotes")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    console.error("[cotizacion] error Supabase:", error.message);
    return { ok: false };
  }
  return { ok: true, id: data?.id as string };
}

export async function listQuotes(): Promise<Quote[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    console.error("[cotizacion] error al listar:", error.message);
    return [];
  }
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    description: r.description,
    items: r.items,
    createdAt: r.created_at,
  }));
}
