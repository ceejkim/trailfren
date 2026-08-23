import { createClient, type Provider, type Session, type User } from "@supabase/supabase-js";
import type { UserProfile } from "./types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? "";
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || "";
const configuredAuthRedirectUrl = import.meta.env.VITE_AUTH_REDIRECT_URL?.trim();

export const supabaseAuthConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = supabaseAuthConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true
      }
    })
  : null;

function clean(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getUserName(user: User) {
  return (
    clean(user.user_metadata?.full_name) ||
    clean(user.user_metadata?.name) ||
    clean(user.email) ||
    clean(user.phone) ||
    "Flock member"
  );
}

function getHandle(user: User, name: string) {
  const emailHandle = user.email?.split("@")[0];
  const phoneHandle = user.phone ? `birder${user.phone.slice(-4)}` : undefined;
  const base = clean(user.user_metadata?.preferred_username) || clean(emailHandle) || clean(phoneHandle) || name;
  return `@${base.toLowerCase().replace(/[^a-z0-9_]+/g, "").slice(0, 18) || "flock"}`;
}

function getInitials(name: string) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return initials || "FB";
}

export function getAuthRedirectUrl() {
  const fallback = window.location.origin;
  const candidate = configuredAuthRedirectUrl || fallback;

  try {
    return new URL(candidate).origin;
  } catch {
    return fallback;
  }
}

export function normalizePhoneNumber(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

export function isValidPhoneNumber(phone: string) {
  return /^\+[1-9]\d{7,14}$/.test(normalizePhoneNumber(phone));
}

export function normalizeOtpCode(token: string) {
  return token.replace(/\D/g, "");
}

export function isValidOtpCode(token: string) {
  return /^\d{4,10}$/.test(normalizeOtpCode(token));
}

export function getProfileFromAuthUser(user: User, currentProfile: UserProfile): UserProfile {
  const name = getUserName(user);

  return {
    ...currentProfile,
    id: user.id,
    name,
    handle: getHandle(user, name),
    avatar: getInitials(name),
    bio: currentProfile.bio || "BirdWatch member"
  };
}

export async function getCurrentAuthSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await getCurrentAuthSession();
  return session?.access_token ? { authorization: `Bearer ${session.access_token}` } : {};
}

export async function signInWithProvider(provider: Extract<Provider, "apple" | "google">) {
  if (!supabase) throw new Error("Supabase Auth is not configured.");

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getAuthRedirectUrl()
    }
  });

  if (error) throw error;
}

export async function sendPhoneOtp(phone: string) {
  if (!supabase) throw new Error("Supabase Auth is not configured.");
  const normalizedPhone = normalizePhoneNumber(phone);
  if (!isValidPhoneNumber(normalizedPhone)) throw new Error("Enter a phone number in international format, like +15551234567.");
  const { error } = await supabase.auth.signInWithOtp({ phone: normalizedPhone });
  if (error) throw error;
}

export async function verifyPhoneOtp(phone: string, token: string) {
  if (!supabase) throw new Error("Supabase Auth is not configured.");
  const normalizedPhone = normalizePhoneNumber(phone);
  const normalizedToken = normalizeOtpCode(token);
  if (!isValidPhoneNumber(normalizedPhone)) throw new Error("Enter a phone number in international format, like +15551234567.");
  if (!isValidOtpCode(normalizedToken)) throw new Error("Enter the code we sent.");
  const { error } = await supabase.auth.verifyOtp({ phone: normalizedPhone, token: normalizedToken, type: "sms" });
  if (error) throw error;
}
