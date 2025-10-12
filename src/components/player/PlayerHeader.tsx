// src/components/player/PlayerHeader.tsx
"use client";

import { glassClass } from "@/components/system/Glass";
import { useEter } from "@/lib/eter/state";
import { Button } from "@/components/ui/button";

export default function PlayerHeader(props: {
    userName: string;
    sigils: number;
    hasCharacter: boolean;
    onOpenSheet: () => void;
}) {
    const { theme, idg } = useEter();

    return (
        <div
            className={glassClass("mb-6 rounded-2xl p-5")}
            style={{ boxShadow: `0 0 0 1px ${theme.accentSoft}` }}
        >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="text-sm opacity-70">O Véu se abre.</div>
                    <h2 className="text-xl font-semibold tracking-wide">Eco de {props.userName}, teu som retorna.</h2>
                    <div className="mt-1 text-xs opacity-70">IDG atual: {idg} • Sigilos: {props.sigils}</div>
                </div>

                <div className="mt-3 sm:mt-0">
                    <Button
                        className="rounded-xl"
                        disabled={!props.hasCharacter}
                        onClick={props.onOpenSheet}
                        title={props.hasCharacter ? "Abrir Ficha" : "Crie um personagem para revelar seu Eco"}
                    >
                        {props.hasCharacter ? "Ver Ficha" : "Criar Personagem"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
