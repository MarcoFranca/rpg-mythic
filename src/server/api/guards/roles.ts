
export type GlobalRole = 'SPECTATOR' | 'PLAYER' | 'GM';

type RoleInput = { accountRole: GlobalRole; sigils: number } | null | undefined;

export function effectiveRole(user: RoleInput): GlobalRole {
    return user ? user.accountRole : 'SPECTATOR';
}
