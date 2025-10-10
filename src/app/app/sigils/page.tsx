"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSigils } from "@/lib/sigils/hooks";
import Link from "next/link";

// Helper para rotular entradas mesmo sem 'label' no tipo
function entryLabel(m: any) {
    return m?.label ?? m?.title ?? m?.note ?? m?.kind ?? "Movimentação";
}

export default function SigilsOverviewPage() {
    const { sigils, isLoading, refresh } = useSigils();

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 border-white/10 bg-white/5 text-white">
                <CardHeader>
                    <CardTitle>Saldo & Limite</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-4xl font-semibold tracking-tight">
                        {isLoading ? "—" : sigils.balance}{" "}
                        <span className="text-base font-normal">sígilos</span>
                    </div>
                    <div className="text-sm text-white/70">
                        {sigils.cap ? (
                            <>
                                Limite atual: <b>{sigils.cap}</b>. Conquiste emblemas para ampliar seu
                                limite ao longo da jornada.
                            </>
                        ) : (
                            <>Sem limite máximo aplicado ao seu perfil no momento.</>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href="/sigils/buy">Comprar</Link>
                        </Button>
                        <Button asChild variant="secondary">
                            <Link href="/sigils/transfer">Transferir</Link>
                        </Button>
                        <Button variant="ghost" onClick={() => refresh()}>
                            Atualizar
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 text-white">
                <CardHeader>
                    <CardTitle>Ganhar Sígilos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-white/80">
                    <ul className="list-disc space-y-1 pl-5">
                        <li>Check-in diário</li>
                        <li>Mestrar sessões</li>
                        <li>Indicar amigos</li>
                        <li>Marcos de campanha</li>
                    </ul>
                    <Button asChild className="mt-2">
                        <Link href="/sigils/earn">Ver oportunidades</Link>
                    </Button>
                </CardContent>
            </Card>

            <Card className="md:col-span-3 border-white/10 bg-white/5 text-white">
                <CardHeader>
                    <CardTitle>Movimentações recentes</CardTitle>
                </CardHeader>
                <CardContent>
                    {sigils.recent?.length ? (
                        <div className="divide-y divide-white/10 text-sm">
                            {sigils.recent.map((m: any) => (
                                <div key={m.id} className="flex items-center justify-between py-2">
                                    <div className="truncate pr-4">{entryLabel(m)}</div>
                                    <div className={m.delta >= 0 ? "text-emerald-300" : "text-rose-300"}>
                                        {m.delta >= 0 ? "+" : ""}
                                        {m.delta}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-white/60 text-sm">Sem registros recentes.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
