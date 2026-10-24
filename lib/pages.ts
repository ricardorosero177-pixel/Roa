import { site } from "./site";
import { getSupabase } from "./supabase";

// Páginas de texto de la tienda (por ahora, la política de devoluciones).
// Con Supabase configurado se leen de la tabla `pages` (editables desde /admin);
// si aún no se han editado, se muestra el texto de abajo.
//
// Formato del contenido (pensado para escribirlo a mano en el panel):
//   ## Título de sección
//   1. Paso numerado
//   - Punto de lista
//   Línea en blanco = nuevo párrafo.

export type Page = {
  slug: string;
  title: string;
  intro: string;
  content: string;
};

export const editablePages = {
  "politicas-devolucion": {
    path: "/politicas-devolucion",
    label: "Política de devoluciones",
  },
} as const;

export type EditablePageSlug = keyof typeof editablePages;

const defaults: Record<EditablePageSlug, Page> = {
  "politicas-devolucion": {
    slug: "politicas-devolucion",
    title: "Política de devoluciones",
    intro: `En ${site.name} queremos que ames lo que recibes. Si algo no resulta como esperabas, te ayudamos a resolverlo.`,
    content: `## Derecho a retracto (Ley del Consumidor)
Según la Ley 19.496, en compras a distancia tienes hasta 10 días corridos desde la recepción del producto para retractarte, siempre que el producto esté sin uso y en su embalaje original.

## Productos con falla
Si tu producto llega dañado o con defecto de fabricación, contáctanos dentro de 7 días con una foto del problema. Coordinamos el cambio o la devolución del dinero, según prefieras.

## Cómo solicitar una devolución
1. Escríbenos a ${site.contact.email} o por WhatsApp ${site.contact.phoneDisplay}.
2. Indícanos tu número de pedido y el motivo.
3. Te damos las instrucciones para el envío de vuelta.
4. Una vez recibido y revisado el producto, procesamos el reembolso o cambio.

## Costos de envío
En caso de falla o error nuestro, nosotros cubrimos el envío. En retractos voluntarios, el costo de devolución es de cargo del cliente.`,
  },
};

export function isEditablePage(slug: string): slug is EditablePageSlug {
  return slug in editablePages;
}

export async function getPage(slug: EditablePageSlug): Promise<Page> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("pages")
      .select("slug, title, intro, content")
      .eq("slug", slug)
      .maybeSingle();
    if (error) console.error("[páginas] error al leer:", error.message);
    else if (data) return data as Page;
  }
  return defaults[slug];
}

export type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "ordered" | "bullets"; items: string[] };

/** Convierte el texto del panel en bloques (títulos, párrafos y listas). */
export function parseContent(content: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };

  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim();
    const ordered = line.match(/^\d+[.)]\s+(.*)$/);
    const bullet = line.match(/^[-•*]\s+(.*)$/);
    const listType = ordered ? "ordered" : bullet ? "bullets" : null;

    if (!line) {
      flush();
    } else if (line.startsWith("#")) {
      flush();
      blocks.push({ type: "heading", text: line.replace(/^#+\s*/, "") });
    } else if (listType) {
      flush();
      const item = (ordered ?? bullet)![1];
      const last = blocks[blocks.length - 1];
      if (last?.type === listType) last.items.push(item);
      else blocks.push({ type: listType, items: [item] });
    } else {
      paragraph.push(line);
    }
  }
  flush();
  return blocks;
}
