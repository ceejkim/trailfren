# Beta Data Infrastructure

Updated: August 23, 2026

## Current State

Trailfren camera APIs now resolve an account before reading or writing camera
state. In production auth mode, the account comes from a verified Supabase bearer
token. The current durable store can use a REST/KV-style backend, but it stores a
single namespaced JSON document.

That is acceptable for previews and controlled field tests. It is not the final
50-user beta data model.

## Target State

Move camera data into owner-scoped records with row-level security:

- every camera record has `owner_id`
- users can read and write only their own records
- clip media is stored privately and referenced by object key
- server routes remain the frontend aggregation boundary
- vendor secrets and camera credentials never enter Postgres from the browser

## Suggested Tables

The first Supabase migration should create:

- `camera_sync_sessions`
- `camera_connection_requests`
- `camera_devices`
- `camera_relay_enrollments`
- `camera_relay_manifests`
- `camera_relay_uploads`
- `camera_clip_ingests`
- `camera_review_items`
- `bird_analyses`
- `bird_corrections`

Each table should include:

- `id text primary key`
- `owner_id uuid not null references auth.users(id)`
- `payload jsonb not null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

## RLS Shape

Every table should enable RLS and use policies equivalent to:

```sql
create policy "Users can read their own camera records"
on camera_devices
for select
using (auth.uid() = owner_id);

create policy "Users can insert their own camera records"
on camera_devices
for insert
with check (auth.uid() = owner_id);

create policy "Users can update their own camera records"
on camera_devices
for update
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);
```

Repeat the policy pattern across the camera and bird review tables.

## Implementation Sequence

1. Configure Supabase Auth in production.
2. Add a Supabase SQL migration for owner-scoped records and RLS.
3. Add a server-side Postgres store adapter behind the existing
   `server/camera-sync-store.js` interface.
4. Backfill from the current JSON document only if preview data matters.
5. Keep `GET /api/cameras/account-state` as the frontend aggregation route.
6. Add smoke coverage for cross-account isolation.
7. Disable the JSON document store for production beta.

## Current Code Signal

`GET /api/cameras/account-state` now returns `readiness`. It tells the app and
deployment checks whether auth, durable storage, relay signing, private clip
storage, and owner-scoped records are ready.

## Not Yet Done

- The Supabase tables and RLS policies have not been created.
- The server store adapter has not been switched from JSON/KV to Postgres
  records.
- Private clip object storage has not been wired into uploads.
