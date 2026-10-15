import "server-only";
import { MercadoPagoConfig } from "mercadopago";

/**
 * Cliente de MercadoPago (servidor).
 * Requiere MERCADOPAGO_ACCESS_TOKEN (secreto, nunca NEXT_PUBLIC_).
 * Si no está configurado, devuelve null y la tienda sigue funcionando sin pago online.
 */
export function mpClient(): MercadoPagoConfig | null {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) return null;
  return new MercadoPagoConfig({
    accessToken,
    options: { timeout: 8000 },
  });
}

export const isMercadoPagoConfigured = () =>
  Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);
