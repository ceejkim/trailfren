-- Owner-scoped camera and bird-review records for the invite-only MVP.
-- Apply through the Supabase migration workflow only after Supabase Auth is
-- configured. Camera media stays outside this schema in a private bucket.

create table if not exists public.camera_sync_sessions (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.camera_connection_requests (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.camera_devices (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.camera_relay_enrollments (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.camera_relay_manifests (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.camera_relay_uploads (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint camera_relay_uploads_event_fields check (
    payload ?& array['deviceId', 'relayId', 'motionEventId']
  )
);

create table if not exists public.camera_clip_ingests (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.camera_review_items (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bird_analyses (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bird_corrections (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists camera_relay_uploads_owner_event_key
  on public.camera_relay_uploads (
    owner_id,
    (payload ->> 'deviceId'),
    (payload ->> 'relayId'),
    (payload ->> 'motionEventId')
  );

create or replace function public.set_camera_record_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'camera_sync_sessions',
    'camera_connection_requests',
    'camera_devices',
    'camera_relay_enrollments',
    'camera_relay_manifests',
    'camera_relay_uploads',
    'camera_clip_ingests',
    'camera_review_items',
    'bird_analyses',
    'bird_corrections'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists "Owners can read camera records" on public.%I', table_name);
    execute format('drop policy if exists "Owners can insert camera records" on public.%I', table_name);
    execute format('drop policy if exists "Owners can update camera records" on public.%I', table_name);
    execute format('drop policy if exists "Owners can delete camera records" on public.%I', table_name);
    execute format('drop trigger if exists set_updated_at on public.%I', table_name);
    execute format(
      'create policy "Owners can read camera records" on public.%I for select using (auth.uid() = owner_id)',
      table_name
    );
    execute format(
      'create policy "Owners can insert camera records" on public.%I for insert with check (auth.uid() = owner_id)',
      table_name
    );
    execute format(
      'create policy "Owners can update camera records" on public.%I for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id)',
      table_name
    );
    execute format(
      'create policy "Owners can delete camera records" on public.%I for delete using (auth.uid() = owner_id)',
      table_name
    );
    execute format(
      'create trigger set_updated_at before update on public.%I for each row execute function public.set_camera_record_updated_at()',
      table_name
    );
  end loop;
end;
$$;
