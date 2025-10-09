import { createSupabaseServerRSC } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
    const supabase = await createSupabaseServerRSC();
    const { data: { user: sUser } } = await supabase.auth.getUser();
    if (!sUser) return null;

    const u = await prisma.user.findUnique({
        where: { supabaseId: sUser.id },
        select: { displayName: true, image: true, email: true }
    });

    return (
        <main className="relative min-h-[100dvh] bg-black text-white">
            <section className="mx-auto max-w-3xl px-6 py-10">
                <h1 className="text-xl font-semibold mb-4">Configurações</h1>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                    <div className="text-sm text-white/80">
                        (Stub) Aqui você poderá alterar nome, avatar, preferências de áudio/tema e segurança.
                    </div>
                    <div className="mt-3 text-xs text-white/60">
                        Email: <b>{u?.email}</b> — Nome atual: <b>{u?.displayName ?? "—"}</b>
                    </div>
                </div>
            </section>
        </main>
    );
}
