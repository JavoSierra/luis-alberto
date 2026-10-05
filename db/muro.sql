-- Base de datos del muro de Compartir (Supabase).
-- Se pega una sola vez en Supabase → SQL Editor → Run.
-- (Creado el 5/10/2026. El editor "Query" de Vercel acepta una sola instrucción: ahí se corrió todo junto dentro de un bloque "do $bloque$ begin ... end $bloque$;")
--
-- Seguridad: las tablas tienen RLS activado y NINGUNA política.
-- Eso significa que con la clave pública nadie puede leer ni escribir nada.
-- Solo el servidor de la página (con la clave secreta, guardada en Vercel) puede hacerlo.

-- Publicaciones del muro
create table if not exists public.publicaciones (
  id uuid primary key default gen_random_uuid(),
  url text not null check (char_length(url) <= 500 and url like 'https://%'),
  dominio text not null,
  comentario text check (comentario is null or char_length(comentario) <= 120),
  -- Toda publicación entra "pendiente". Solo se muestra cuando el dueño la cambia a "aprobada".
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aprobada', 'rechazada')),
  reportes integer not null default 0,
  -- IP "hasheada" (convertida en un código que no se puede revertir). Solo se usa para el límite de envíos.
  ip_hash text not null,
  creado timestamptz not null default now(),
  -- Vencimiento automático a los 30 días
  vence timestamptz not null default now() + interval '30 days'
);

create index if not exists publicaciones_visibles on public.publicaciones (estado, vence);
create index if not exists publicaciones_por_ip on public.publicaciones (ip_hash, creado);

alter table public.publicaciones enable row level security;

-- Reportes: una persona (IP hasheada) puede reportar cada publicación una sola vez
create table if not exists public.reportes (
  publicacion_id uuid not null references public.publicaciones (id) on delete cascade,
  ip_hash text not null,
  creado timestamptz not null default now(),
  primary key (publicacion_id, ip_hash)
);

alter table public.reportes enable row level security;

-- Registra un reporte y actualiza el contador de la publicación.
-- Con 3 reportes o más, la publicación deja de mostrarse hasta que el dueño la revise.
create or replace function public.reportar_publicacion(pid uuid, hash text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into reportes (publicacion_id, ip_hash) values (pid, hash) on conflict do nothing;
  update publicaciones
     set reportes = (select count(*) from reportes where publicacion_id = pid)
   where id = pid;
$$;

-- La función solo la puede usar el servidor (clave secreta), no el público
revoke execute on function public.reportar_publicacion(uuid, text) from public, anon, authenticated;
