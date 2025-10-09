import type { AccountRole, RoleTrack } from "@prisma/client";
import { thresholdForTrack } from "./sigils";

export function canChooseTrack(currentTrack: RoleTrack | null | undefined): boolean {
    return !currentTrack; // só se nunca escolheu
}

export function canPromoteFromSpectator(track: RoleTrack, sigils: number): boolean {
    return sigils >= thresholdForTrack(track);
}

export function mustDemote(currentRole: AccountRole, track: RoleTrack | null | undefined, sigils: number): boolean {
    if (currentRole === "SPECTATOR" || !track) return false;
    return sigils < thresholdForTrack(track);
}

export function canReturnToTrack(currentRole: AccountRole, track: RoleTrack | null | undefined, sigils: number): boolean {
    if (currentRole !== "SPECTATOR" || !track) return false;
    return sigils >= thresholdForTrack(track);
}

