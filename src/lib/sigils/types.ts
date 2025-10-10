// Tipos canônicos de Sígilos (compartilhados entre API e UI)
export type SigilEntry = {
    id: string;
    delta: number;            // +ganho / -gasto
    reason: string;           // "Indicação", "Compra", "Transferência p/ X", etc.
    createdAt: string;        // ISO string
    label?: string;
    title?: string;
    note?: string;
    kind?: string;
};

export type SigilsPayload = {
    balance: number;          // saldo atual
    cap?: number | null;      // limite (opcional; null/undefined => sem limite)
    recent: SigilEntry[];     // últimos lançamentos
};
