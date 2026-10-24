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
  items?: { id?: string; title: string; quantity: number; unit_price: number }[];
  customer?: {
    nombre?: string;
    correo?: string;
    whatsapp?: string;
    direccion?: string;
    comuna?: string;
  };
  fulfillment?: Fulfillment;
  notes?: string;
  createdAt?: string;
};

/** Estado de despacho, que se maneja a mano desde el panel. */
export const fulfillmentSteps = ["nuevo", "preparando", "enviado", "entregado"] as const;
export type Fulfillment = (typeof fulfillmentSteps)[number];
export const fulfillmentLabel: Record<Fulfillment, string> = {
  nuevo: "Nuevo",
  preparando: "Preparando",
  enviado: "Enviado",
  entregado: "Entregado",
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
    customer: order.customer ?? {},
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

  // Sin created_at: MercadoPago avisa varias veces por el mismo pago y la fecha
  // debe quedar la del primer aviso (la pone la base de datos al insertar).
  // Tampoco se tocan fulfillment ni notes, que se editan desde el panel.
  const upsertRow: Partial<typeof row> = { ...row };
  delete upsertRow.created_at;
  const { error } = await supabase
    .from("orders")
    .upsert(upsertRow, { onConflict: "mp_payment_id" });
  if (error) {
    console.error("[orden] error Supabase:", error.message);
    return;
  }

  if (order.status === "approved") await applyStockOnce(order);
}

/**
 * Descuenta el stock de un pedido pagado, una sola vez aunque el webhook
 * llegue repetido: solo quien logra marcar stock_applied=true descuenta.
 */
async function applyStockOnce(order: Order): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  const { data, error } = await supabase
    .from("orders")
    .update({ stock_applied: true })
    .eq("mp_payment_id", order.mpPaymentId)
    .eq("stock_applied", false)
    .select("id");
  if (error || !data?.length) return;

  for (const it of order.items ?? []) {
    const productId = Number(it.id);
    if (!Number.isInteger(productId) || productId <= 0) continue;
    const { error: rpcError } = await supabase.rpc("decrement_stock", {
      p_id: productId,
      p_qty: it.quantity,
    });
    if (rpcError) console.error("[orden] error al descontar stock:", rpcError.message);
  }
}

export async function updateOrderFulfillment(
  mpPaymentId: string,
  fulfillment: Fulfillment,
  notes: string,
): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase
    .from("orders")
    .update({ fulfillment, notes })
    .eq("mp_payment_id", mpPaymentId);
  if (error) console.error("[orden] error al actualizar:", error.message);
  return !error;
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
    customer: r.customer ?? {},
    fulfillment: r.fulfillment ?? "nuevo",
    notes: r.notes ?? "",
    createdAt: r.created_at,
  }));
}
