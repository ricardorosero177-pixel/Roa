import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-roa flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-6xl text-dorado">404</p>
      <h1 className="mt-4 font-display text-2xl">Página no encontrada</h1>
      <p className="mt-2 text-tinta-70">La página que buscas no existe o fue movida.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-dorado">Inicio</Link>
        <Link href="/tienda" className="btn-ghost">Ir a la tienda</Link>
      </div>
    </div>
  );
}
