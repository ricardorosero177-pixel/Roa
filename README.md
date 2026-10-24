# RÖA — Tienda online

Ecommerce de decoración minimalista construido con **Next.js 16 + React 19 + Tailwind 4 + Supabase**, listo para SEO, Google Search, Meta Ads y Google Ads.

## Qué incluye

- **Catálogo** con tus 13 productos reales, categorías y páginas de producto.
- **Carrito** (persistente en el navegador) y **solicitud de cotización** (sin pago online, como pediste).
- **Blog** optimizado para SEO con 3 artículos iniciales.
- **Páginas**: inicio, tienda, categorías, quiénes somos, devoluciones y privacidad (Ley 21.719).
- **Panel admin** en `/admin`: resumen de ventas, productos (precio, stock, fotos), pedidos con estado de despacho, cotizaciones, blog y reseñas.
- **SEO técnico**: metadata dinámica, Open Graph, `sitemap.xml`, `robots.txt`, `manifest`, imagen OG generada.
- **Datos estructurados (schema.org)**: `OnlineStore`, `Product`, `BlogPosting`, `BreadcrumbList`, `ItemList`, `WebSite` con buscador. Esto hace que Google reconozca el sitio como ecommerce.
- **Marketing**: Google Tag Manager, GA4, Google Ads y Meta Pixel con **Google Consent Mode v2** y banner de cookies. Eventos de conversión: `view_item`, `add_to_cart`, `generate_lead` (Lead en Meta).

## Puesta en marcha (local)

```bash
cd roa
cp .env.example .env.local   # y completa los valores que quieras
npm install
npm run dev                  # http://localhost:3000
```

La tienda funciona sin configurar nada: sin Supabase usa los productos de `lib/catalog.ts`,
los artículos de `lib/posts.ts` y las reseñas de `lib/reviews.ts`, y el panel queda en modo solo lectura.

## Supabase (base de datos del panel)

Con Supabase, productos, blog, reseñas, pedidos y cotizaciones se guardan en la base de datos
y se editan desde `/admin`.

1. Crea un proyecto gratis en https://supabase.com
2. En el editor SQL, ejecuta `supabase/schema.sql` y luego `supabase/seed.sql`
   (carga los productos, artículos y reseñas iniciales).
3. Copia en `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (el panel y la tienda leen y escriben con ella desde el servidor)
4. Define `ADMIN_PASSWORD` y `ADMIN_SECRET` para proteger `/admin`.

Los pedidos pagados descuentan stock automáticamente (webhook de MercadoPago), y el checkout
toma nombre y precio desde el catálogo, nunca desde el navegador.

## Despliegue en Vercel

1. Sube este proyecto a GitHub.
2. En https://vercel.com importa el repo (detecta Next.js solo).
3. Carga las mismas variables de entorno en Project → Settings → Environment Variables.
4. Deploy. Tendrás una URL tipo `https://roa.vercel.app`.
5. Cuando tengas dominio propio, agrégalo en Vercel y cambia `NEXT_PUBLIC_SITE_URL`.

## Checklist para aparecer en Google

1. Despliega el sitio (paso anterior).
2. Entra a **Google Search Console** (https://search.google.com/search-console), agrega tu dominio.
3. Verifica con el método "etiqueta HTML" y pega el código en `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
4. Envía `https://TU-DOMINIO/sitemap.xml` en Search Console → Sitemaps.
5. Prueba los datos estructurados en https://search.google.com/test/rich-results
6. Para Google Merchant / anuncios de Shopping, el `Product` schema ya está listo.

## Marketing digital

- **Google Ads**: crea un contenedor GTM, ponlo en `NEXT_PUBLIC_GTM_ID`, y configura la conversión sobre el evento `generate_lead`.
- **Meta Ads**: pon tu pixel en `NEXT_PUBLIC_META_PIXEL_ID`. El evento `Lead` se dispara al enviar una cotización.
- El consentimiento de cookies controla cuándo se activan (cumple Ley 21.719).

## Editar contenido

- **Productos**: `lib/catalog.ts`
- **Blog**: `lib/posts.ts`
- **Marca, contacto, redes**: `lib/site.ts`

## Estructura

```
app/            Páginas (App Router) + sitemap, robots, manifest, OG
components/      Header, Footer, carrito, tarjetas, analítica, consentimiento
lib/             Datos (catálogo, blog), Supabase, SEO (schema.org), tracking
supabase/        schema.sql
```
