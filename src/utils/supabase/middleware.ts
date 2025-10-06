import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieSetItem = { name: string; value: string; options?: CookieOptions };

export function updateSession(request: NextRequest) {
    // Em dev, encaminhe headers para evitar glitches
    const requestHeaders = new Headers(request.headers);
    const response = NextResponse.next({ request: { headers: requestHeaders } });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const pub = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !pub) return response;

    // Adapter híbrido — atende libs antigas (getAll/setAll) e novas (get/set/remove)
    const cookiesAdapter: {
        // shape novo
        get(name: string): string | undefined;
        set(name: string, value: string, options?: CookieOptions): void;
        remove(name: string, options?: CookieOptions): void;
        // shape antigo
        getAll(): Array<{ name: string; value: string }>;
        setAll(items: CookieSetItem[]): void;
    } = {
        get(name) {
            return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
            response.cookies.set({ name, value, ...(options ?? {}) });
        },
        remove(name, options) {
            response.cookies.set({ name, value: "", ...(options ?? {}), maxAge: 0 });
        },
        getAll() {
            return request.cookies.getAll().map(c => ({ name: c.name, value: c.value }));
        },
        setAll(items) {
            for (const { name, value, options } of items) {
                response.cookies.set({ name, value, ...(options ?? {}) });
            }
        },
    };

    const supabase = createServerClient(url, pub, { cookies: cookiesAdapter });

    // Só sincroniza sessão (nada de redirect aqui)
    supabase.auth.getUser().catch(() => {});

    return response;
}
