// src/lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
// import type { Database } from "@/lib/supabase/types"; // (opcional) tipos do seu projeto

export async function createSupabaseServerClient() {
    const cookieStore = await Promise.resolve(cookies());

    const supabase = createServerClient/* <Database> */(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                // Em ambientes onde headers já foram enviados, set/remove pode lançar.
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch {}
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: "", ...options, maxAge: 0 });
                    } catch {}
                },
            },
        }
    );

    return supabase;
}
