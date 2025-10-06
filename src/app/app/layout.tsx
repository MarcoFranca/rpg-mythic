import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                get: (name) => cookieStore.get(name)?.value,
                set() {}, remove() {},
            },
        }
    );

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect("/login");

    return <div className="min-h-dvh">{children}</div>;
}
