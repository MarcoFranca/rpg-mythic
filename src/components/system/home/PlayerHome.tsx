"use client";

import { motion } from "framer-motion";
import { PlayerObelisk } from "@/components/player/PlayerObelisk";
import { CampaignCircle, type Campaign } from "@/components/player/CampaignCircle";
import { FaithMeter } from "@/components/player/FaithMeter";
import { CharacterSummary } from "@/components/player/CharacterSummary";
import { useEter } from "@/lib/eter/state";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { glassClass } from "@/components/system/Glass";

export default function PlayerHome({
                                       counts,
                                       campaigns,
                                       userName,
                                   }: {
    counts: { myMemberships: number };
    campaigns: Campaign[];
    userName: string;
}) {
    const { setIDG } = useEter();
    const [panel, setPanel] = useState<"character" | "inventory" | "spells" | "campaigns" | null>(null);

    return (
        <>
            {/* Saudações */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 text-center"
            >
                <p className="text-sm opacity-75">O Véu se abre.</p>
                <h1 className="text-balance text-3xl font-semibold leading-tight md:text-4xl">
                    Eco de {userName}, teu som ressoa novamente.
                </h1>
                <p className="mt-1 text-xs opacity-70">Campanhas vivas: {counts.myMemberships}</p>
            </motion.div>

            {/* Grid principal */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Coluna esquerda */}
                <div className="md:col-span-2">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <CharacterSummary
                            name="Aeryn Vardanos"
                            lineage="Drakhen"
                            level={5}
                            portraitUrl={null}
                            onOpenSheet={() => setPanel("character")}
                        />
                        <FaithMeter faith={62} ether={48} corruption={18} />
                    </div>

                    <div className="mt-6">
                        {campaigns.length ? (
                            <CampaignCircle campaigns={campaigns} />
                        ) : (
                            <div className="grid place-items-center">
                                <div className={glassClass("p-5 text-center max-w-md")}>
                                    <div className="mb-1 text-sm opacity-80">Nenhum Véu pulsa por você… ainda.</div>
                                    <div className="mb-3 text-xs opacity-70">
                                        Encontre uma mesa pública ou deixe que mestres ouçam seu chamado.
                                    </div>
                                    <div className="flex justify-center gap-2">
                                        <Button asChild><a href="/app/tables/discover">Encontrar mesa pública</a></Button>
                                        <Button variant="secondary" asChild><a href="/app/calls/new">Criar Pedido de Entrada</a></Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Coluna direita: Obelisco */}
                <div className="relative flex flex-col items-center">
                    {/* z-index alto para não colidir com os botões dev */}
                    <div className="z-20">
                        <PlayerObelisk onOpen={(s) => setPanel(s)} />
                    </div>

                    {/* (1) Mais espaço entre obelisco e controles dev */}
                    <div className="z-10 mt-15 grid grid-cols-3 gap-3 text-xs opacity-85">
                        <Button variant="secondary" onClick={() => setIDG(10)}>Harmonia</Button>
                        <Button variant="secondary" onClick={() => setIDG(45)}>Equilíbrio</Button>
                        <Button variant="secondary" onClick={() => setIDG(85)}>Dissonância</Button>
                    </div>
                </div>
            </div>

            {/* Painel inferior (placeholder) */}
            {panel && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-2xl rounded-t-2xl border border-white/10 bg-black/60 p-4 backdrop-blur"
                >
                    <div className="mb-2 text-sm opacity-80">
                        {panel === "character" && "Eco da Alma — Ficha do Personagem"}
                        {panel === "inventory" && "Inventário Mítico"}
                        {panel === "spells" && "Vibração do Éter — Magias"}
                        {panel === "campaigns" && "Atravessar o Véu — Campanhas"}
                    </div>
                    <p className="text-xs opacity-70">(Conteúdo placeholder. Aqui você pluga a UI real.)</p>
                    <div className="mt-3 text-right">
                        <Button onClick={() => setPanel(null)} className="rounded-xl">Silenciar</Button>
                    </div>
                </motion.div>
            )}
        </>
    );
}
