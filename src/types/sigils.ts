// /types/sigils.ts
export type SigilSource =
    | "purchase" | "referral" | "daily_login" | "gm_session"
    | "transfer_in" | "admin_grant";

export type SigilSink =
    | "create_character" | "extra_slot" | "join_campaign"
    | "cosmetic" | "transfer_out" | "admin_charge";

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
