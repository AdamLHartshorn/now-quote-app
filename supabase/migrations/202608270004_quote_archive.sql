create table public.quote_archive (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(customer_name) between 1 and 120),
  quote_type text not null,
  amount numeric(12,2) not null check (amount >= 0),
  summary jsonb not null check (jsonb_typeof(summary) = 'object'),
  rate_version integer not null check (rate_version > 0),
  created_at timestamptz not null default now()
);

alter table public.quote_archive enable row level security;
grant select, insert, delete on table public.quote_archive to service_role;
create index quote_archive_created_at_idx on public.quote_archive (created_at desc);
create index quote_archive_customer_name_idx on public.quote_archive (lower(customer_name));
