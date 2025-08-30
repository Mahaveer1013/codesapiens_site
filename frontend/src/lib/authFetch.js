// src/lib/authFetch.ts
import { supabase } from "./supabaseClient";

/**
 * Calls an endpoint on your own Express API.
 * The JWT from Supabase Auth is automatically added.
 */
export async function authFetch(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  // 1️⃣ Get the current session (includes access_token)
  const { data: { session } } = await supabase.auth.getSession();

  // 2️⃣ If a user is logged in, attach the token
  const authHeaders: HeadersInit = {};
  if (session?.access_token) {
    authHeaders["Authorization"] = `Bearer ${session.access_token}`;
  }

  // 3️⃣ Merge user‑provided headers with our auth header
  const mergedInit: RequestInit = {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      ...authHeaders,
    },
  };

  const resp = await fetch(input, mergedInit);

  // Optional: auto‑logout on 401 to keep UI clean
  if (resp.status === 401) {
    await supabase.auth.signOut();
    // You could also redirect to /login here
  }

  return resp;
}