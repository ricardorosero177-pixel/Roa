import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { getSupabase } from "./supabase";
import type { Quote } from "./types";

// Archivo local de respaldo (solo para desarrollo, cuando no hay Supabase).
const LOCAL_FILE = path.join(process.cwd(), ".data", "quotes.json");

async function readLocal(): Promise<Quote[]> {
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8");
    return JSON.parse(raw) as Quote[];
  } catch {
    return [];
  }
}

async function writeLocal(quotes: Quote[]) {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(quotes, null, 2), "utf8");
}

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
    // Sin base de datos: guardamos en archivo local para poder verlo en /admin.
    try {
      const all = await readLocal();
      all.unshift({ id: `local-${Date.now()}`, ...quote, createdAt: row.created_at });
      await writeLocal(all);
    } catch (e) {
      console.info("[cotizacion] (no se pudo guardar local):", e);
    }
    return { ok: true };
  }

  const { data, error } = await supabase.from("quotes").insert(row).select("id").single();
  if (error) {
    console.error("[cotizacion] error Supabase:", error.message);
    return { ok: false };
  }
  return { ok: true, id: data?.id as string };
}

export async function listQuotes(): Promise<Quote[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return readLocal();
  }
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
