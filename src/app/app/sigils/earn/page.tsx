// src/app/app/sigils/earn/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SigilsEarnPage() {
    const actions = [
        { key: "daily", title: "Check-in diário", desc: "Entre todo dia e colete um pequeno bônus.", cta: "Coletar" },
        { key: "gm", title: "Mestrar sessão", desc: "Finalize uma sessão como GM e receba sígilos.", cta: "Ver requisitos" },
        { key: "invite", title: "Indicar amigos", desc: "Ganhe ao indicar novos jogadores e mestres.", cta: "Gerar link" },
        { key: "milestones", title: "Marcos de campanha", desc: "Conquiste marcos dentro de campanhas ativas.", cta: "Explorar" },
    ] as const;

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {actions.map((a) => (
                <Card key={a.key} className="border-white/10 bg-white/5 text-white">
                    <CardHeader>
                        <CardTitle>{a.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between gap-4">
                        <div className="text-sm text-white/80">{a.desc}</div>
                        <Button variant="secondary">{a.cta}</Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
