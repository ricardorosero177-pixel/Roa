/**
 * Configuración central de la marca RÖA.
 * Cambia aquí datos de contacto, dominio y marketing sin tocar el resto del código.
 */

export const site = {
  name: "RÖA",
  legalName: "RÖA Home & Style",
  tagline: "Bienestar cotidiano para tu hogar",
  description:
    "RÖA es una marca de bienestar y estilo de vida. Decoración, aromas y detalles elegidos con intención para transformar tus espacios y rutinas en momentos de calma, armonía y belleza cotidiana.",
  // Dominio público (se puede sobrescribir con NEXT_PUBLIC_SITE_URL)
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://somosroa.cl",
  locale: "es_CL",
  currency: "CLP",
  country: "CL",
  city: "La Florida, Santiago",
  contact: {
    email: "roa.home.style@gmail.com",
    phoneDisplay: "+56 9 7999 1519",
    whatsapp: "56979991519",
    instagram: "roa.home.style",
    instagramUrl: "https://instagram.com/roa.home.style",
  },
  whatsappMessage:
    "Hola RÖA 👋 Vi un producto que me interesa y quiero más información sobre cómo comprar.",
  // IDs de marketing (se cargan desde variables de entorno)
  analytics: {
    gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
    googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "",
    ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? "",
  },
} as const;

export const nav = [
  { label: "Inicio", href: "/" },
  { label: "Tienda", href: "/tienda" },
  { label: "Quiénes somos", href: "/quienes-somos" },
  { label: "Blog", href: "/blog" },
  { label: "Devoluciones", href: "/politicas-devolucion" },
] as const;

export function whatsappLink(message: string = site.whatsappMessage) {
  return `https://api.whatsapp.com/send/?phone=${site.contact.whatsapp}&text=${encodeURIComponent(
    message,
  )}&type=phone_number`;
}
