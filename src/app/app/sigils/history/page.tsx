// app/sigils/history/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSigils } from "@/lib/sigils/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Row = { id: string; at: string; label: string; delta: number };

export default function SigilsHistoryPage() {
    const { sigils } = useSigils();
    const [rows, setRows] = useState<Row[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);

    const load = async (p: number) => {
        setLoading(true);
        try {
            const r = await fetch(`/api/sigils/history?page=${p}`, { cache: "no-store" });
            const data = (await r.json()) as Row[];
            if (p === 0) setRows(data);
            else setRows((prev) => [...prev, ...data]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(0); }, []);

    return (
        <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
                <CardTitle>Histórico de Movimentações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-sm text-white/70">Saldo atual: <b>{sigils.balance}</b></div>

                {rows.length ? (
                    <div className="divide-y divide-white/10 rounded-lg border border-white/10">
                        {rows.map((r) => (
                            <div key={r.id} className="grid grid-cols-12 items-center gap-2 px-4 py-2 text-sm">
                                <div className="col-span-3 text-white/60">{new Date(r.at).toLocaleString()}</div>
                                <div className="col-span-7">{r.label}</div>
                                <div
                                    className={`col-span-2 text-right ${r.delta >= 0 ? "text-emerald-300" : "text-rose-300"}`}
                                >
                                    {r.delta >= 0 ? "+" : ""}{r.delta}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-white/60">Sem registros.</div>
                )}

                <div className="flex justify-end">
                    <Button
                        variant="secondary"
                        onClick={async () => {
                            const next = page + 1;
                            await load(next);
                            setPage(next);
                        }}
                        disabled={loading}
                    >
                        {loading ? "Carregando..." : "Carregar mais"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
