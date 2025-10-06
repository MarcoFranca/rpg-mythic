import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export function updateSession(request: NextRequest) {
    // Em dev, reencaminha headers p/ evitar glitches
    const requestHeaders = new Headers(request.headers);
    const response = NextResponse.next({ request: { headers: requestHeaders } });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const pub = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !pub) return response;

    // Adapter híbrido: suporta get/set/remove (novo) e getAll/setAll (antigo)
    const cookiesAdapter = {
        // NOVO shape
        get: (name: string) => request.cookies.get(name)?.value,
        set: (name: string, value: string, options?: any) =>
            response.cookies.set({ name, value, ...(options || {}) }),
        remove: (name: string, options?: any) =>
            response.cookies.set({ name, value: "", ...(options || {}), maxAge: 0 }),

        // ANTIGO shape
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: Array<{ name: string; value: string; options?: any }>) => {
            for (const { name, value, options } of cookiesToSet) {
                response.cookies.set({ name, value, ...(options || {}) });
            }
        },
    } as unknown as Parameters<typeof createServerClient>[2]["cookies"];

    const supabase = createServerClient(url, pub, { cookies: cookiesAdapter });

    // Só sincroniza a sessão (nada de redirect aqui)
    supabase.auth.getUser().catch(() => {});
    return response;
}
