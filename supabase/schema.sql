-- Esquema y seguridad de base de datos para RÖA (Supabase / PostgreSQL)
-- Ejecuta este SQL en el editor SQL de tu proyecto Supabase.

-- 1) Tabla de cotizaciones
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

-- 2) Row Level Security: bloquea todo por defecto.
alter table public.quotes enable row level security;

-- 3) Privilegios mínimos.
-- El público (clave anon) solo puede INSERTAR; nunca leer, modificar ni borrar.
revoke all on public.quotes from anon, authenticated;
grant insert on public.quotes to anon, authenticated;

-- 4) Política de inserción con validación de longitudes (defensa en profundidad).
drop policy if exists "quotes_insert_public" on public.quotes;
create policy "quotes_insert_public"
  on public.quotes
  for insert
  to anon, authenticated
  with check (
    char_length(name) between 1 and 120
    and char_length(email) between 3 and 160
    and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and char_length(coalesce(phone, '')) between 3 and 40
    and char_length(coalesce(description, '')) <= 2000
  );

-- 5) Lectura: NO se crea política de SELECT para anon/authenticated.
--    El panel /admin lee con la SERVICE ROLE (SUPABASE_SERVICE_ROLE_KEY),
--    que ignora RLS y es secreta: solo vive en el servidor, nunca en el navegador.

-- Nota: nunca expongas SUPABASE_SERVICE_ROLE_KEY en variables NEXT_PUBLIC_*.


-- 6) Tabla de pedidos (pagos de MercadoPago)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  mp_payment_id text unique not null,
  status text not null,
  amount numeric not null default 0,
  email text,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- RLS: nadie accede con la clave pública. El webhook y el panel usan la service role.
alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;
-- No se crean policies para anon/authenticated: solo la service role (servidor) lee/escribe.
