-- Esquema de base de datos para RÖA (Supabase / PostgreSQL)
-- Ejecuta este SQL en el editor SQL de tu proyecto Supabase.

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  description text,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists quotes_created_at_idx on public.quotes (created_at desc);

-- Seguridad a nivel de fila: el sitio escribe con la service role (bypassa RLS).
-- Activamos RLS para que nadie lea las cotizaciones con la clave pública (anon).
alter table public.quotes enable row level security;

-- Permitimos que cualquiera (clave anon) INSERTE una cotización desde el sitio,
-- pero NO que lea las cotizaciones de otros. La lectura (panel /admin) se hace
-- con la service role, que ignora RLS.
drop policy if exists "quotes_insert_public" on public.quotes;
create policy "quotes_insert_public"
  on public.quotes
  for insert
  to anon, authenticated
  with check (true);

-- (Opcional) Si prefieres que SOLO el servidor pueda insertar, elimina la policy
-- anterior y define SUPABASE_SERVICE_ROLE_KEY en el entorno.
