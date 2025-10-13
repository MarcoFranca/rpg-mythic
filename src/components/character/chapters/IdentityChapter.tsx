"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type IdentityData = { name: string; concept?: string };

type Props = {
    value: IdentityData | null;
    onChange: (v: IdentityData) => void;
    onContinue?: () => void;
};

export default function IdentityChapter({ value, onChange, onContinue }: Props) {
    const [name, setName] = useState(value?.name ?? "");
    const [concept, setConcept] = useState(value?.concept ?? "");

    useEffect(() => {
        onChange({ name, concept: concept.trim() || undefined });
    }, [name, concept, onChange]);

    return (
        <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur">
                <CardHeader>
                    <CardTitle>Quem canta através de você?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs uppercase tracking-wider text-white/60">Nome do Personagem</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex.: Lira Vaelorin"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs uppercase tracking-wider text-white/60">Conceito</label>
                        <Textarea
                            value={concept}
                            onChange={(e) => setConcept(e.target.value)}
                            placeholder="Ex.: Caçadora de fendas que ouve sussurros do Éter."
                            rows={3}
                        />
                        <p className="mt-2 text-xs text-white/60">
                            Dica Elyriana: “nomeia o sopro e o propósito”. Em Eldoryon, identidade é o **timbre** da sua alma.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={onContinue}
                            disabled={!name.trim()}
                        >
                            Continuar para Classe
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
