import { CombatFlags } from "@/server/zod/character-blocks";

export type ConditionImpact = {
    speedMultiplier?: number;      // ex.: 0 => speed 0; 0.5 => metade
    setSpeedToZero?: boolean;      // sobrescreve direto p/ 0
    acBonus?: number;              // raros casos (+/- CA)
    flags?: Partial<CombatFlags>;  // desvantagens/comportamentos
};

export const CONDITION_RULES: Record<string, ConditionImpact> = {
    blinded: {
        flags: {
            attackDisadvantage: true,     // ataques do personagem
            attackedByAdvantage: true,    // ataques contra o personagem
            // abilityChecks que dependam de visão → UI pode tratar
        },
    },
    restrained: {
        setSpeedToZero: true,
        flags: {
            attackDisadvantage: true,
            attackedByAdvantage: true,
            stealthDisadvantage: true,
        },
    },
    grappled: {
        setSpeedToZero: true,
    },
    poisoned: {
        flags: {
            abilityChecksDisadvantage: true,
            attackDisadvantage: true,
        },
    },
    // Exaustão 5e (2014):
    // 1: desvantagem em ability checks
    // 2: speed reduzida à metade
    // 3: desvantagem em ataques e testes de resistência
    // 4: HP máximo reduzido à metade (não tratamos aqui)
    // 5: speed = 0
    // 6: morte
};

export function impactFromExhaustion(level: number): ConditionImpact {
    if (level >= 6) return { setSpeedToZero: true, flags: { attackDisadvantage: true, abilityChecksDisadvantage: true } };
    if (level >= 5) return { setSpeedToZero: true };
    if (level >= 4) return { flags: { abilityChecksDisadvantage: true, attackDisadvantage: true } };
    if (level >= 3) return { flags: { attackDisadvantage: true } };
    if (level >= 2) return { speedMultiplier: 0.5 };
    if (level >= 1) return { flags: { abilityChecksDisadvantage: true } };
    return {};
}
