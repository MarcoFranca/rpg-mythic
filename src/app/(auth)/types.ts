export type ActionState =
    | { ok: true }
    | { ok: false; message?: string; error?: Record<string, string[]> }
    | null;
