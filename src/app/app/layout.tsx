// src/app/app/layout.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerRSC } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { AppTopbar } from "@/components/system/AppTopbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    // RSC-safe client: pode ler cookies, mas não escrever
    const supabase = await createSupabaseServerRSC();

    // exige sessão para acessar /app/*
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect("/login");

    // carrega dados mínimos pro topo e saudação
    const { data: { user: sUser } } = await supabase.auth.getUser();
    const db = sUser
        ? await prisma.user.findUnique({
            where: { supabaseId: sUser.id },
            select: { accountRole: true, displayName: true, email: true, image: true },
        })
        : null;

    return (
        <div className="min-h-dvh bg-black text-white">
            {db && (
                <AppTopbar
                    role={db.accountRole}
                    name={db.displayName ?? "Viajante"}
                    email={db.email}
                    image={db.image}
                />
            )}
            {/* Dica: deixe o WelcomeToastOnce só aqui OU só na Home para evitar duplicidade */}
            {/*<WelcomeToastOnce role={db?.accountRole ?? "SPECTATOR"} name={db?.displayName ?? undefined} />*/}

            {children}
        </div>
    );
}
