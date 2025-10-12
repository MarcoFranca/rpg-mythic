// src/components/system/home/PlayerHome.tsx
"use client";

import { motion } from "framer-motion";
import { PlayerObelisk } from "@/components/player/PlayerObelisk";
// import { CampaignCircle, type Campaign } from "@/components/player/CampaignCircle"; // (ative quando usar)
import type { Campaign } from "@/components/player/CampaignCircle";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { glassClass } from "@/components/system/Glass";
import { useRouter } from "next/navigation";
import OnboardingCoach from "@/components/player/OnboardingCoach";
import { useAudio } from "@/app/providers/audio-provider";
// import SoundHover from "@/components/system/SoundHover"; // (ative quando usar)

export default function PlayerHome({
                                       counts,
                                       campaigns,
                                       userName,
                                       hasCharacter,
                                       primaryCharacterId,
                                   }: {
    counts: { myMemberships: number };
    campaigns: Campaign[];
    userName: string;
    hasCharacter: boolean;
    primaryCharacterId?: string | null;
}) {
    const [panel, setPanel] = useState<"character" | "inventory" | "spells" | "campaigns" | null>(null);
    const router = useRouter();
    const { playSfx: play } = useAudio();
    const playHover = () => play("hover");

    return (
        <>
            {/* Saudação simples */}
            <section className="mb-6">
                <div className="text-sm opacity-75">O Véu se abre.</div>
                <h1 className="text-balance text-3xl font-semibold leading-tight md:text-4xl">
                    Eco de {userName}, teu som ressoa novamente.
                </h1>
                <p className="mt-1 text-xs opacity-70">Campanhas vivas: {counts.myMemberships}</p>
            </section>

            {/* Caminho do Cântico (onboarding) */}
            <section className="mb-6">
                <OnboardingCoach
                    hasCharacter={hasCharacter}
                    campaignCount={counts.myMemberships}
                    primaryCharacterId={primaryCharacterId ?? undefined}
                />
            </section>

            {/* Grid principal: (campanhas desativadas por enquanto) + Obelisco */}
            <div className="mt-16">
                {/* Quando quiser reativar a visualização de campanhas, descomente o bloco abaixo */}
                {/*
        <div className="md:col-span-2">
          {campaigns.length ? (
            <SoundHover onHover={playHover}>
              <CampaignCircle campaigns={campaigns} />
            </SoundHover>
          ) : (
            <div className="grid place-items-center">
              <div className={glassClass("max-w-md rounded-2xl p-5 text-center")}>
                <div className="mb-2 text-sm opacity-80">Nenhum Véu ativo.</div>
                <div className="flex justify-center gap-2">
                  <Button asChild><a href="/app/campaigns">Encontrar campanha</a></Button>
                  <Button variant="secondary" asChild><a href="/app/calls/new">Criar chamado</a></Button>
                </div>
              </div>
            </div>
          )}
        </div>
        */}

                {/* Obelisco reativo (hub) */}
                <div className="relative flex flex-col items-center">
                    <div className="z-20">
                        <PlayerObelisk
                            highlight={!hasCharacter}
                            hasCharacter={hasCharacter}
                            hasCampaigns={(campaigns?.length ?? 0) > 0}
                            onOpen={(id) => {
                                if (id === "character" && !hasCharacter) {
                                    router.push("/app/characters/new");
                                    return;
                                }
                                if (id === "campaigns" && !(campaigns?.length)) {
                                    router.push("/app/campaigns");
                                    return;
                                }
                                setPanel(id);
                            }}
                        />
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
