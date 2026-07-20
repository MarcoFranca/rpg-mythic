// src/app/app/characters/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerRSC } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function CharactersHubPage() {
    const supabase = await createSupabaseServerRSC();
    const { data: { user: sUser } } = await supabase.auth.getUser();
    if (!sUser) return null;

    // pega o id interno do usuário
    const u = await prisma.user.findUnique({
        where: { supabaseId: sUser.id },
        select: { id: true },
    });
    if (!u) return null;

    // ajuste os campos conforme seu schema de Character
    const chars = await prisma.character.findMany({
        where: { userId: u.id },
        select: {
            id: true,
            name: true,       // se o campo tiver outro nome, troque aqui
            state: true,
            // portraitUrl: true, // se existir
        },
        orderBy: { createdAt: "desc" },
    });

    const draft = chars.find((character) => character.state === "DRAFT");
    const completedCharacters = chars.filter((character) => character.state === "COMPLETE");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Seus Ecos</h1>
                <Button asChild><Link href="/app/characters/new">{draft ? "Retomar criação" : "Criar novo"}</Link></Button>
            </div>

            {draft && (
                <div className="rounded-xl border border-cyan-200/20 bg-cyan-100/[0.06] p-5 text-sm text-cyan-50/85">
                    <div className="font-medium text-white">Um Eco ainda está sendo revelado</div>
                    <p className="mt-1 text-cyan-50/70">Retome o Livro do Jogador para revisar ou mudar qualquer escolha já salva.</p>
                    <Button className="mt-3" size="sm" asChild><Link href="/app/characters/new">Retomar criação</Link></Button>
                </div>
            )}

            {completedCharacters.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
                    Você ainda não revelou um Eco. Comece criando seu primeiro personagem.
                    <div className="mt-3">
                        <Button asChild><Link href="/app/characters/new">Criar Personagem</Link></Button>
                    </div>
                </div>
            ) : (
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {completedCharacters.map((c) => (
                        <li key={c.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <div className="text-sm font-medium">{c.name ?? `Eco ${c.id.slice(0, 6)}`}</div>
                            <div className="mt-2">
                                <Button size="sm" asChild>
                                    <Link href={`/app/characters/${c.id}`}>Abrir ficha</Link>
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
