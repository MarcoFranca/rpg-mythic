import { createSupabaseServerRSC } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GMSidebar } from "@/components/system/gm/GMSidebar";

export default async function GMLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createSupabaseServerRSC();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect("/login");

    const { data: { user } } = await supabase.auth.getUser();
    const role = (user?.user_metadata?.role as "PLAYER"|"GM"|"SPECTATOR"|undefined) ?? undefined;

    // Gate simples; se quiser, troque pelo papel vindo do Prisma
    if (role !== "GM") redirect("/app");

    return (
        <div className="min-h-dvh bg-black text-white">
            <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
                <GMSidebar />
                <main className="min-w-0 flex-1">{children}</main>
            </div>
        </div>
    );
}
