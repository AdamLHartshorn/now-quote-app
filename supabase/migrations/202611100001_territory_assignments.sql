create table public.territory_assignments (
  zip_code text primary key check (zip_code ~ '^\d{5}$'),
  rep text not null check (rep in ('Adam', 'Brad', 'Dawn', 'Jon', 'Shawn')),
  updated_at timestamptz not null default now()
);

alter table public.territory_assignments enable row level security;
grant select, insert, update on table public.territory_assignments to service_role;
