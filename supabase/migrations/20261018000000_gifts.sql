-- Packs offerts (cadeau de bienvenue, récompense de partage) : un seul cadeau de chaque type par compte.
create table if not exists public.gifts (
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('welcome', 'share')),
  product_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, kind)
);

alter table public.gifts enable row level security;

-- Le joueur peut seulement lire ses propres cadeaux ; seule la fonction claim-gift (clé service) écrit.
create policy "gifts_select_own" on public.gifts
  for select using (auth.uid() = user_id);
