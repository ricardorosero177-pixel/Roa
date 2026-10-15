import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { getSupabase } from "./supabase";

export type Order = {
  id?: string;
  mpPaymentId: string;
  status: string;
  amount: number;
  email?: string;
  items?: { title: string; quantity: number; unit_price: number }[];
  createdAt?: string;
};

const LOCAL_FILE = path.join(process.cwd(), ".data", "orders.json");

async function readLocal(): Promise<Order[]> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8")) as Order[];
  } catch {
    return [];
  }
}
async function writeLocal(orders: Order[]) {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(orders, null, 2), "utf8");
}

export async function saveOrder(order: Order): Promise<void> {
  const supabase = getSupabase();
  const row = {
    mp_payment_id: order.mpPaymentId,
    status: order.status,
    amount: order.amount,
    email: order.email ?? null,
    items: order.items ?? [],
    created_at: new Date().toISOString(),
  };

  if (!supabase) {
    try {
      const all = await readLocal();
      // upsert por mpPaymentId
      const rest = all.filter((o) => o.mpPaymentId !== order.mpPaymentId);
      rest.unshift({ ...order, createdAt: row.created_at });
      await writeLocal(rest);
    } catch (e) {
      console.info("[orden] no se pudo guardar local:", e);
    }
    return;
  }

  const { error } = await supabase
    .from("orders")
    .upsert(row, { onConflict: "mp_payment_id" });
  if (error) console.error("[orden] error Supabase:", error.message);
}

export async function listOrders(): Promise<Order[]> {
  const supabase = getSupabase();
  if (!supabase) return readLocal();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    console.error("[orden] error al listar:", error.message);
    return [];
  }
  return (data ?? []).map((r) => ({
    id: r.id,
    mpPaymentId: r.mp_payment_id,
    status: r.status,
    amount: r.amount,
    email: r.email,
    items: r.items,
    createdAt: r.created_at,
  }));
}
