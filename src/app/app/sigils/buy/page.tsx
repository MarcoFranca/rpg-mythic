"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PACKS = [
    { id: "p50", qty: 50, price: 9.9 },
    { id: "p120", qty: 120, price: 19.9 },
    { id: "p320", qty: 320, price: 44.9 },
    { id: "p800", qty: 800, price: 99.9 },
];

export default function SigilsBuyPage() {
    const [selected, setSelected] = useState(PACKS[1].id);
    const [pending, start] = useTransition();

    const onBuy = () => {
        start(async () => {
            const r = await fetch("/api/sigils/buy/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ packId: selected }),
            });
            if (r.ok) {
                const { checkoutUrl } = await r.json();
                window.location.href = checkoutUrl;
            } else {
                // TODO: toast de erro
            }
        });
    };

    return (
        <Card className="max-w-xl border-white/10 bg-white/5 text-white">
            <CardHeader>
                <CardTitle>Comprar Sígilos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <fieldset className="grid gap-3">
                    {PACKS.map((p) => (
                        <label
                            key={p.id}
                            className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition
                ${selected === p.id ? "border-white/20 bg-white/10" : "border-white/10 bg-black/20 hover:bg-black/30"}`}
                        >
              <span className="flex items-center gap-3">
                <input
                    type="radio"
                    name="pack"
                    value={p.id}
                    checked={selected === p.id}
                    onChange={() => setSelected(p.id)}
                    className="h-4 w-4 accent-white"
                />
                <span className="text-sm">
                  <div className="font-medium">{p.qty} sígilos</div>
                  <div className="text-white/60">Pacote {p.id.toUpperCase()}</div>
                </span>
              </span>
                            <span className="text-sm font-medium">R$ {p.price.toFixed(2)}</span>
                        </label>
                    ))}
                </fieldset>

                <Button onClick={onBuy} disabled={pending} className="w-full">
                    {pending ? "Redirecionando..." : "Continuar para pagamento"}
                </Button>
            </CardContent>
        </Card>
    );
}
