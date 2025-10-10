// app/sigils/transfer/page.tsx
"use client";

import { useState, useTransition } from "react";
import { useSigils } from "@/lib/sigils/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SigilsTransferPage() {
    const { sigils, refresh } = useSigils();
    const [pending, start] = useTransition();
    const [toEmail, setToEmail] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [note, setNote] = useState("");

    const onSubmit = () => {
        if (!amount || !toEmail) return;
        start(async () => {
            const r = await fetch("/api/sigils/transfer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to: toEmail, amount, note }),
            });
            if (r.ok) {
                setNote(""); setAmount(0); setToEmail("");
                await refresh();
                // pode acionar um toast aqui
            } else {
                // tratar erro / toast
            }
        });
    };

    return (
        <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
                <CardTitle>Transferir Sígilos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="to">Enviar para (email)</Label>
                    <Input id="to" placeholder="jogador@exemplo.com" value={toEmail} onChange={(e) => setToEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="amt">Quantidade</Label>
                    <Input
                        id="amt"
                        type="number"
                        min={1}
                        max={sigils.cap ?? undefined}
                        value={amount || ""}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="note">Mensagem (opcional)</Label>
                    <Input id="note" placeholder="Obrigado pela sessão!" value={note} onChange={(e) => setNote(e.target.value)} />
                </div>
                <div className="md:col-span-2 flex items-center justify-between">
                    <div className="text-sm text-white/70">Saldo disponível: <b>{sigils.balance}</b></div>
                    <Button onClick={onSubmit} disabled={pending || !toEmail || !amount}>
                        {pending ? "Enviando..." : "Transferir"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
