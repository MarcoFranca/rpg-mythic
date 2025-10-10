// /types/sigils.ts
export type SigilSource =
    | "purchase" | "referral" | "daily_login" | "gm_session"
    | "transfer_in" | "admin_grant";

export type SigilSink =
    | "create_character" | "extra_slot" | "join_campaign"
    | "cosmetic" | "transfer_out" | "admin_charge";

export type SigilKind =
    | "purchase"
    | "transfer_in"
    | "transfer_out"
    | "earn_daily"
    | "earn_gm"
    | "earn_invite"
    | "milestone"
    | "spend_campaign"
    | "spend_character"
    | "adjustment";

export interface SigilEntry {
    id: string;           // uuid/ksuid
    at: string;           // ISO date string
    kind: SigilKind;
    delta: number;        // + ganha / - gasta
    title?: string;       // rótulo amigável (opcional)
    note?: string;        // observação (opcional)
    meta?: Record<string, unknown>;
}

export interface SigilsPayload {
    balance: number;
    cap?: number | null;
    recent: SigilEntry[];
}
export type SigilLedgerEntry = {
    id: string;
    userId: string;
    delta: number;             // + ganho / - gasto
    reason: SigilSource | SigilSink;
    meta?: Record<string, any>; // campaignId, sessionId, etc.
    createdAt: string;
};

export type UserSigils = {
    balance: number;           // saldo atual (pode ser "ilimitado" sem cap)
    cap?: number | null;       // cap dinâmico opcional
    streak?: { count: number; lastAt: string };
    emblems?: { id: string; name: string; capBonus: number }[];
};
