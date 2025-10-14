"use client";
import { useMemo, useState, useCallback } from "react";
import PlayerBookLayout from "@/components/character/PlayerBookLayout";
import BookNav, { BookChapter } from "@/components/character/BookNav";
import ClassChapter from "@/components/character/chapters/ClassChapter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sparkles, User, ScrollText, Star, Heart, Shield } from "lucide-react";
import type { ClassSummaryT } from "@/server/api/routers/catalog/class";
import IdentityChapter, { type IdentityData } from "@/components/character/chapters/IdentityChapter";
import { api } from "@/trpc/react";

type WizardState = {
    draftId?: string;
    identity: IdentityData | null;
    ancestryId?: string;
    classId?: string;
};

const chapters: BookChapter[] = [
    { id: "identity", title: "Identidade", description: "Nome, conceito e voz do Cântico", icon: User },
    { id: "ancestry", title: "Ancestralidade", description: "Origens e ecos da linhagem", icon: ScrollText },
    { id: "class", title: "Classe", description: "Papel, mecânicas e estilo de jogo", icon: Shield },
    { id: "attributes", title: "Atributos", description: "Força do sopro e da vontade", icon: Star },
    { id: "faith", title: "Fé & Éter", description: "Fé, Éter Vivo e Sombrasangue", icon: Heart },
    { id: "review", title: "Revisão & Cântico", description: "Snapshot e finalizar", icon: Sparkles },
];

export default function NewCharacterPage() {
    const utils = api.useUtils();
    const [current, setCurrent] = useState<string>("identity");
    const [wiz, setWiz] = useState<WizardState>({ identity: null });
    const canGoClass = !!wiz.identity?.name?.trim();

    const checkNameAvailability = useCallback(
        (name: string) => utils.name.check.fetch({ name }), // <- usa 'check'
        [utils]
    );

    const completedMap = useMemo(() => {
        return new Set<string>([
            ...(wiz.identity ? ["identity"] : []),
            ...(wiz.ancestryId ? ["ancestry"] : []),
            ...(wiz.classId ? ["class"] : []),
        ]);
    }, [wiz]);

    const side = (
        <BookNav
            chapters={chapters.map((c) => ({
                ...c,
                completed: completedMap.has(c.id),
                disabled: c.id === "class" && !canGoClass,
            }))}
            currentId={current}
            onSelect={(id) => {
                if (id === "class" && !canGoClass) return;
                setCurrent(id);
            }}
        />
    );

    const identityBadge = wiz.identity?.name ? <Badge variant="secondary">{wiz.identity.name}</Badge> : null;

    return (
        <PlayerBookLayout title="Livro do Jogador – Criação" subtitle="“Tudo o que é criado deve cantar.”" sidebar={side}>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    {identityBadge}
                    {wiz.classId && <Badge variant="outline">Classe definida</Badge>}
                </div>
                <Separator className="bg-white/10" />

                {current === "identity" && (
                    <IdentityChapter
                        value={wiz.identity}
                        onChange={(val) => setWiz((p) => ({ ...p, identity: val }))}
                        onContinue={() => setCurrent("class")}
                        checkNameAvailability={checkNameAvailability}
                        allowDuplicateNames={true}
                    />
                )}

                {current === "class" && (
                    <ClassChapter
                        selectedClassId={wiz.classId}
                        onSelect={(c: ClassSummaryT) => {
                            setWiz((prev) => ({ ...prev, classId: c.id }));
                        }}
                    />
                )}

                {current !== "class" && (
                    <div className="text-sm text-white/70">
                        Este capítulo (“{current}”) ainda não foi ativado nesta versão. Avance para{" "}
                        <Button variant="link" className="px-1" onClick={() => setCurrent("class")}>
                            Classe
                        </Button>
                        .
                    </div>
                )}
            </div>
        </PlayerBookLayout>
    );
}
