import { prisma } from "@/lib/prisma";
import { createSupabaseServerRSC } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LoginPageClient from "@/components/auth/LoginPageClient";

const SYSTEM_HOME = "/app"; // <<< troque aqui se necessário

export default async function LoginPage({
                                            searchParams,
                                        }: {
    searchParams: { from?: string; role?: "PLAYER" | "GM" | "SPECTATOR"; needsConfirm?: string; email?: string };
}) {
    const supabase = await createSupabaseServerRSC();
    const { data: { user } } = await supabase.auth.getUser();

    // se veio do OAuth Google após "register"
    if (user && searchParams?.from === "register") {
        if (searchParams?.role) {
            await prisma.user.updateMany({
                where: { supabaseId: user.id, accountRole: "SPECTATOR" },
                data: { accountRole: searchParams.role },
            });
        }
        redirect(`${SYSTEM_HOME}?welcome=1&name=${encodeURIComponent(user.user_metadata?.name ?? "Aventureiro")}`);
    }

    // se caiu aqui por "precisa confirmar email", só mostra o cartão
    // (LoginPageClient renderiza instrução se needsConfirm=1)
    return <LoginPageClient needsConfirm={searchParams?.needsConfirm === "1"} email={searchParams?.email} />;
}
