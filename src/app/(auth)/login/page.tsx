// app/(auth)/login/page.tsx
import { prisma } from "@/lib/prisma";
import { createSupabaseServerRSC } from "@/lib/supabase/server";
import LoginPageClient from "@/components/auth/LoginPageClient";

export default async function LoginPage({ searchParams }: { searchParams: { from?: string; role?: "PLAYER"|"GM"|"SPECTATOR" } }) {
    const supabase = await createSupabaseServerRSC(); // <- AQUI
    const { data: { user } } = await supabase.auth.getUser();

    if (user && searchParams?.from === "register" && searchParams?.role) {
        await prisma.user.updateMany({
            where: { supabaseId: user.id, accountRole: "SPECTATOR" },
            data: { accountRole: searchParams.role },
        });
    }
    return <LoginPageClient />;
}
