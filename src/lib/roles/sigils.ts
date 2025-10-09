export const PLAYER_MIN_SIGILS = 5;
export const GM_MIN_SIGILS = 8;

export function thresholdForTrack(track: "PLAYER" | "GM"): number {
    return track === "GM" ? GM_MIN_SIGILS : PLAYER_MIN_SIGILS;
}
