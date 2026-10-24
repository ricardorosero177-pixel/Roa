import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { getAllPosts } from "@/lib/posts";
import { PostForm } from "@/components/admin/PostForm";
import { Flash, type PanelSearchParams } from "@/components/admin/ui";

export default async function EditarArticuloPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: PanelSearchParams;
}) {
  await requireAdmin();
  const { slug } = await params;
  const post = (await getAllPosts()).find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="mt-8 max-w-3xl">
      <h2 className="font-display text-xl">Editar: {post.title}</h2>
      <Flash searchParams={searchParams} />
      <PostForm post={post} />
    </div>
  );
}
