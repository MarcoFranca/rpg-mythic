import { AccountRole } from "@prisma/client";

export type GlobalRole = AccountRole;

// Adapte a assinatura para sigils
type RoleInput = { accountRole: GlobalRole; sigils: number } | null | undefined;

// Regra simples: por enquanto o papel efetivo == papel da conta.
// (Se depois quiser “promover” por sigils, mude aqui.)
export function effectiveRole(user: RoleInput): GlobalRole {
    if (!user) return AccountRole.SPECTATOR;
    return user.accountRole;
}
