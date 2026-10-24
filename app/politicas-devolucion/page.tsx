import type { Metadata } from "next";
import { getPage, parseContent } from "@/lib/pages";

export const metadata: Metadata = {
  title: "Política de devoluciones",
  description:
    "Conoce la política de cambios y devoluciones de RÖA. Tu satisfacción es nuestra prioridad.",
  alternates: { canonical: "/politicas-devolucion" },
};

export default async function DevolucionesPage() {
  const page = await getPage("politicas-devolucion");
  const blocks = parseContent(page.content);

  return (
    <div className="container-roa max-w-3xl py-12">
      <h1 className="font-display text-4xl">{page.title}</h1>
      {page.intro && <p className="mt-3 text-tinta-70">{page.intro}</p>}

      <div className="mt-8 space-y-4 text-tinta-70">
        {blocks.map((b, i) => {
          if (b.type === "heading") {
            return (
              <h2 key={i} className="pt-4 font-display text-xl text-tinta first:pt-0">
                {b.text}
              </h2>
            );
          }
          if (b.type === "paragraph") return <p key={i}>{b.text}</p>;
          const List = b.type === "ordered" ? "ol" : "ul";
          return (
            <List
              key={i}
              className={`space-y-1 pl-5 ${b.type === "ordered" ? "list-decimal" : "list-disc"}`}
            >
              {b.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </List>
          );
        })}
      </div>
    </div>
  );
}
