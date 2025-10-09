import type { Role } from "./permissions";
import { Permissions, type Ability } from "./permissions";

export function can(role: Role, ability: Ability): boolean {
    return Permissions.for(role).has(ability);
}

/** atalho de uso frequente: nega jogada se não puder */
export function assertCan(role: Role, ability: Ability) {
    if (!can(role, ability)) throw new Error("Permissão negada.");
}
