import type { Post } from "./types";
import { getSupabase } from "./supabase";

const CDN =
  "https://d2uil25qo43m6t.cloudfront.net/t/w_1200,h_675,q_auto,f_auto,c_fill,b_rgb:ffffff/shops/fotos";

export const posts: Post[] = [
  {
    slug: "cuando-el-hogar-se-convierte-en-experiencia",
    title: "Cuando el hogar se convierte en experiencia",
    excerpt:
      "El hogar refleja a quien lo habita. Te contamos por qué los detalles correctos transforman un espacio en un refugio.",
    category: "Bienestar",
    date: "2026-01-16",
    cover: `${CDN}/202601121504397357-d7881e31-793b-436f-88f7-c27a5beb7afc-md.jpg`,
    readingMinutes: 4,
    content: [
      "En RÖA creemos que la casa es mucho más que un lugar donde vivir: es el reflejo de quien la habita. Cada rincón cuenta una historia, y los objetos que elegimos tienen el poder de transformar un espacio en una experiencia.",
      "La decoración recargada y las modas pasajeras saturan. Nosotros preferimos lo contrario: diseños simples, colores neutros y piezas que se integran de forma natural, aportando equilibrio y sentido en vez de ruido visual.",
      "Un florero nórdico, una escultura de líneas limpias o un pequeño detalle dorado pueden cambiar por completo la energía de una habitación. No se trata de llenar, sino de elegir con intención.",
      "En un mundo acelerado, el hogar debería ser un refugio: un lugar para descansar, recuperar el ánimo y volver a conectar contigo. Ese es el espíritu de cada pieza que creamos.",
      "En este blog compartiremos inspiración, ideas de decoración, nuevos lanzamientos y la historia detrás de la marca. Bienvenida y bienvenido a la comunidad RÖA.",
    ],
  },
  {
    slug: "5-detalles-minimalistas-que-transforman-tu-living",
    title: "5 detalles minimalistas que transforman tu living",
    excerpt:
      "Pequeños cambios, gran impacto. Cinco ideas simples y económicas para renovar tu living sin reformas.",
    category: "Ideas de decoración",
    date: "2026-02-03",
    cover: `${CDN}/202601121510237397-55804908-30ca-45db-ae01-15717d498223-md.jpg`,
    readingMinutes: 5,
    content: [
      "No necesitas una gran inversión para renovar tu espacio. A veces, los detalles correctos logran más que un mueble nuevo. Aquí van cinco ideas que puedes aplicar hoy.",
      "1. Un punto focal escultórico. Una pieza decorativa con carácter, como una escultura de ala o un corazón moderno, atrae la mirada y ordena visualmente la habitación.",
      "2. Floreros con flores secas. Aportan textura y calidez sin el mantenimiento de las flores frescas. Un florero nórdico grande da altura; uno pequeño, equilibrio.",
      "3. Acentos dorados con medida. Un detalle dorado suma lujo discreto. La clave es la moderación: uno o dos puntos, no más.",
      "4. Paleta neutra y coherente. Beige, crema, blanco y tonos tierra generan calma. Deja que los objetos hablen por su forma, no por el color.",
      "5. Espacio para respirar. El minimalismo no es vacío, es intención. Deja aire alrededor de cada pieza para que luzca.",
      "Con estos cinco gestos, tu living pasa de ordinario a acogedor sin gastar de más. Esa es la filosofía RÖA.",
    ],
  },
  {
    slug: "como-elegir-el-florero-perfecto-para-cada-espacio",
    title: "Cómo elegir el florero perfecto para cada espacio",
    excerpt:
      "Tamaño, forma y ubicación: la guía RÖA para acertar con el florero según cada rincón de tu casa.",
    category: "Guías",
    date: "2026-02-20",
    cover: `${CDN}/202601121509086205-54419f5f-c6f8-4bd6-be4e-eddc94baf641-md.jpg`,
    readingMinutes: 4,
    content: [
      "El florero es uno de los objetos decorativos más versátiles. Bien elegido, se convierte en el detalle que une toda una habitación. Aquí te ayudamos a acertar.",
      "Para mesas de centro y escritorios, un florero pequeño de líneas nórdicas aporta equilibrio sin robar protagonismo. Es ideal para una sola flor o un ramo delicado.",
      "Para rincones de piso o repisas altas, un florero grande con pampas o flores secas genera altura y presencia. Funciona de maravilla en recibidores.",
      "La forma importa: las líneas rectas transmiten orden y modernidad; las curvas, suavidad y calidez. Elige según la energía que quieras dar al espacio.",
      "Y recuerda la regla de oro del minimalismo: menos, pero mejor. Un florero con intención vale más que diez objetos sin propósito.",
    ],
  },
];

// Con Supabase configurado, los artículos se leen de la tabla `posts`
// (editables desde /admin). Sin Supabase, se usa la lista de arriba.

type PostRow = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  cover: string;
  reading_minutes: number;
  content: string;
  published: boolean;
};

function rowToPost(r: PostRow): Post {
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    category: r.category,
    date: r.date,
    cover: r.cover,
    readingMinutes: r.reading_minutes,
    // En la base de datos los párrafos se separan con una línea en blanco.
    content: r.content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    published: r.published,
  };
}

/** Todos los artículos, incluidos los borradores (para el panel). */
export async function getAllPosts(): Promise<Post[]> {
  const supabase = getSupabase();
  let list: Post[] = posts.map((p) => ({ ...p, published: true }));
  if (supabase) {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) console.error("[blog] error al listar:", error.message);
    else list = (data as PostRow[]).map(rowToPost);
  }
  return list.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Artículos publicados, del más nuevo al más antiguo. */
export async function getPosts(): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => p.published !== false);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((p) => p.slug === slug);
}
