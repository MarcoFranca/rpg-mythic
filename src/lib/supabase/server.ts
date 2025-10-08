// src/lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

function required(name: string, value: string | undefined) {
    if (!value) throw new Error(`Missing env "${name}". Verifique .env.local/Vercel.`);
    return value;
}

const SUPABASE_URL = required(
    "SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
);

const SUPABASE_ANON_KEY = required(
    "SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY
);

/**
 * ➜ Use em Server Components (RSC). Lê cookies; set/remove = NO-OP.
 */
export async function createSupabaseServerRSC() {
    const cookieStore = await cookies(); // <- assíncrono na sua tipagem

    return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        cookies: {
            get(name: string) {
                return cookieStore.get(name)?.value;
            },
            set(_name: string, _value: string, _options: CookieOptions) {
                // NO-OP em RSC
            },
            remove(_name: string, _options: CookieOptions) {
                // NO-OP em RSC
            },
        },
    });
}

/**
 * ➜ Use em Server Actions/Route Handlers. Pode escrever cookies.
 */
export async function createSupabaseServerAction() {
    const cookieStore = await cookies(); // <- assíncrono na sua tipagem

    return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        cookies: {
            get(name: string) {
                return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
                cookieStore.set({ name, value, ...options });
            },
            remove(name: string, options: CookieOptions) {
                cookieStore.set({ name, value: "", ...options, maxAge: 0 });
            },
        },
    });
}
