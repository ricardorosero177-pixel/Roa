/**
 * Helpers de conversión para marketing (lado cliente).
 * Empujan eventos a GTM/GA4 (dataLayer) y a Meta Pixel.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event: name, ...params });
}

export function trackViewContent(product: {
  id: number;
  name: string;
  price: number;
}) {
  trackEvent("view_item", {
    ecommerce: {
      currency: "CLP",
      value: product.price,
      items: [{ item_id: String(product.id), item_name: product.name, price: product.price }],
    },
  });
  window.fbq?.("track", "ViewContent", {
    content_ids: [String(product.id)],
    content_name: product.name,
    content_type: "product",
    value: product.price,
    currency: "CLP",
  });
}

export function trackAddToCart(product: { id: number; name: string; price: number }) {
  trackEvent("add_to_cart", {
    ecommerce: {
      currency: "CLP",
      value: product.price,
      items: [{ item_id: String(product.id), item_name: product.name, price: product.price }],
    },
  });
  window.fbq?.("track", "AddToCart", {
    content_ids: [String(product.id)],
    content_name: product.name,
    value: product.price,
    currency: "CLP",
  });
}

/** Evento de conversión principal: solicitud de cotización (lead). */
export function trackLead(value: number) {
  trackEvent("generate_lead", { value, currency: "CLP" });
  window.fbq?.("track", "Lead", { value, currency: "CLP" });
}
