import { createClient } from "@supabase/supabase-js";

let cachedClient;
let cachedConfigKey;

function clean(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getHeader(request, name) {
  const headers = request.headers ?? {};
  const lowerName = name.toLowerCase();
  if (typeof headers.get === "function") return headers.get(name) ?? headers.get(lowerName);
  return headers[name] ?? headers[lowerName];
}

function getBearerToken(request) {
  const authorization = clean(getHeader(request, "authorization"));
  if (!authorization) return undefined;
  const match = authorization.match(/^bearer\s+([^\s]+)$/i);
  return clean(match?.[1]);
}

function getSupabaseConfig() {
  const url = clean(process.env.SUPABASE_URL) || clean(process.env.VITE_SUPABASE_URL);
  const key =
    clean(process.env.SUPABASE_PUBLISHABLE_KEY) ||
    clean(process.env.SUPABASE_ANON_KEY) ||
    clean(process.env.VITE_SUPABASE_PUBLISHABLE_KEY) ||
    clean(process.env.VITE_SUPABASE_ANON_KEY);

  if (!url || !key) return null;

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "https:" && parsedUrl.hostname !== "localhost") {
      throw new Error("Supabase URL must use https outside localhost.");
    }
  } catch {
    throw new Error("Supabase Auth server URL is invalid.");
  }

  return { url, key };
}

export function isSupabaseAuthConfigured() {
  return Boolean(getSupabaseConfig());
}

function getSupabaseClient(config) {
  const configKey = `${config.url}:${config.key}`;
  if (!cachedClient || cachedConfigKey !== configKey) {
    cachedClient = createClient(config.url, config.key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    cachedConfigKey = configKey;
  }
  return cachedClient;
}

export async function getVerifiedSupabaseUser(request) {
  const token = getBearerToken(request);
  if (!token) return null;

  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("Supabase Auth server environment is not configured.");
  }

  const { data, error } = await getSupabaseClient(config).auth.getUser(token);
  if (error || !data.user) {
    throw new Error("Supabase session is invalid or expired.");
  }

  return data.user;
}
