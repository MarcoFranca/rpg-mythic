import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import WelcomeToastOnce from "@/components/system/WelcomeToastOnce";
import {createSupabaseServerRSC} from "@/lib/supabase/server";
import {prisma} from "@/lib/prisma";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();

    const supabase = await createSupabaseServerRSC();
    const { data: { user } } = await supabase.auth.getUser();
    const db = user
        ? await prisma.user.findUnique({
            where: { supabaseId: user.id },
            select: { accountRole: true, displayName: true },
        })
        : null;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect("/login");

    return <div className="min-h-dvh">
        <WelcomeToastOnce role={db?.accountRole ?? "SPECTATOR"} name={db?.displayName ?? undefined} />

        {children}
    </div>;
}
