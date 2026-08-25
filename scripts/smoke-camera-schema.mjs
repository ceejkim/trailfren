import { readFile } from "node:fs/promises";

const migration = await readFile(
  new URL("../supabase/migrations/20260825090000_owner_scoped_camera_records.sql", import.meta.url),
  "utf8"
);

const expectedTables = [
  "camera_sync_sessions",
  "camera_connection_requests",
  "camera_devices",
  "camera_relay_enrollments",
  "camera_relay_manifests",
  "camera_relay_uploads",
  "camera_clip_ingests",
  "camera_review_items",
  "bird_analyses",
  "bird_corrections"
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const table of expectedTables) {
  assert(migration.includes(`create table if not exists public.${table}`), `missing ${table} table`);
  assert(migration.includes(`'${table}'`), `missing ${table} RLS setup`);
}

assert(migration.includes("owner_id uuid not null references auth.users(id) on delete cascade"), "missing auth-owned records");
assert(migration.includes("enable row level security"), "missing RLS enablement");
assert(migration.includes("auth.uid() = owner_id"), "missing owner RLS predicate");
assert(migration.includes("camera_relay_uploads_owner_event_key"), "missing relay idempotency index");
assert(migration.includes("payload ?& array['deviceId', 'relayId', 'motionEventId']"), "missing relay event payload guard");
assert(migration.includes("set_camera_record_updated_at"), "missing updated-at trigger");

console.log(JSON.stringify({ tables: expectedTables.length, rls: "owner-scoped", relayIdempotency: "database-unique" }, null, 2));
