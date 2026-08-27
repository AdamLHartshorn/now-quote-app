create table public.route_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 100),
  territory text not null check (territory in ('N','NE','E','SE','S','SW','W','NW')),
  start_name text not null,
  start_address text not null,
  start_latitude double precision not null,
  start_longitude double precision not null,
  stops jsonb not null check (jsonb_typeof(stops) = 'array' and jsonb_array_length(stops) between 1 and 20),
  total_distance_miles numeric(8,1) not null check (total_distance_miles >= 0),
  total_duration_minutes integer not null check (total_duration_minutes >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.route_plans enable row level security;
grant select, insert, update, delete on table public.route_plans to service_role;
create index route_plans_updated_at_idx on public.route_plans (updated_at desc);
