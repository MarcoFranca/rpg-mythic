// src/lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

function required(name: string, value: string | undefined) {
    if (!value) {
        throw new Error(
            `Missing env "${name}". Verifique .env.local ou as variáveis na Vercel.`
        );
    }
    return value;
}

const SUPABASE_URL = required(
    "SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
);

const SUPABASE_ANON_KEY = required(
    "SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY
);

export async function createSupabaseServerClient() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options }); // forma correta no Next 14
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.set({ name, value: "", ...options, maxAge: 0 }); // remove = set com maxAge: 0
                },
            },
        }
    );

    return supabase;
}

export const createSupabaseServer = createSupabaseServerClient;
