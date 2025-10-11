"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { glassClass } from "@/components/system/Glass";

type Props = {
    /** o jogador já possui ao menos 1 personagem? */
    hasCharacter: boolean;
    /** quantidade de campanhas em que ele está (membership) */
    campaignCount: number;
};

export default function OnboardingCoach({ hasCharacter, campaignCount }: Props) {
    // Deriva estado dos passos
    const step1Done = hasCharacter;
    const step2Available = hasCharacter;   // só habilita quando tem personagem
    const step2Done = campaignCount > 0;

    // Mensagem principal
    const title = !step1Done
        ? "Crie teu Eco da Alma para começar a jornada."
        : !step2Done
            ? "Teu Eco está pronto. Entra num Véu e começa a aventura."
            : "Tudo pronto! Continua tua jornada nas campanhas.";

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={glassClass("p-4 md:p-5")}
            role="status"
            aria-live="polite"
        >
            <div className="mb-3 text-sm text-white/80">{title}</div>

            <ol className="space-y-2 text-sm">
                {/* Passo 1 */}
                <li className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
            <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                    step1Done ? "bg-emerald-500/30 ring-1 ring-emerald-400/40" : "bg-white/10 ring-1 ring-white/15"
                }`}
                aria-label={step1Done ? "concluído" : "pendente"}
            >
              {step1Done ? "✓" : "1"}
            </span>
                        <span>Cria teu personagem (Eco da Alma)</span>
                    </div>

                    {!step1Done && (
                        <Button size="sm" asChild>
                            <Link href="/app/characters/new">Criar personagem</Link>
                        </Button>
                    )}
                </li>

                {/* Passo 2 */}
                <li className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
            <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                    step2Done ? "bg-emerald-500/30 ring-1 ring-emerald-400/40" : "bg-white/10 ring-1 ring-white/15"
                }`}
                aria-label={step2Done ? "concluído" : "pendente"}
            >
              {step2Done ? "✓" : "2"}
            </span>
                        <span>Entra numa campanha (Véu)</span>
                    </div>

                    {!step2Done && (
                        <div className="flex gap-2">
                            <Button size="sm" asChild disabled={!step2Available} title={!step2Available ? "Crie um personagem antes" : ""}>
                                <Link href="/app/campaigns">Encontrar campanha</Link>
                            </Button>
                            <Button size="sm" variant="secondary" asChild disabled={!step2Available}>
                                <Link href="/app/calls/new">Pedir entrada</Link>
                            </Button>
                        </div>
                    )}
                </li>
            </ol>
        </motion.div>
    );
}
