// /src/lib/sigils/hooks.ts
"use client";

import useSWR from "swr";
import type { SigilsPayload, SigilEntry } from "@/types/sigils";

// fetcher genérico tipado
const fetcher = async <T = unknown>(url: string): Promise<T> => {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json() as Promise<T>;
};

// helpers de narrowing
function isRecord(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}
function asString(v: unknown): string | undefined {
    return typeof v === "string" ? v : undefined;
}
function asNumber(v: unknown): number | undefined {
    if (typeof v === "number") return v;
    if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) {
        return Number(v);
    }
    return undefined;
}
function asMeta(v: unknown): Record<string, unknown> | undefined {
    return isRecord(v) ? v : undefined;
}

function normalize(payload: unknown): SigilsPayload {
    const p = (isRecord(payload) ? payload : {}) as Record<string, unknown>;

    const balance = asNumber(p.balance) ?? 0;
    const capRaw = p.cap;
    const cap =
        capRaw === null || capRaw === undefined
            ? null
            : (asNumber(capRaw) ?? null);

    const recentRaw = Array.isArray(p.recent) ? p.recent : [];

    // Mapeia para SigilEntry | null (nunca undefined) e filtra com type guard
    const recent = recentRaw
        .map((m: unknown): SigilEntry | null => {
            if (!isRecord(m)) return null;

            const id = asString(m.id) ?? Math.random().toString(36).slice(2);
            const at =
                asString(m.at) ??
                asString(m.createdAt) ??
                new Date().toISOString();

            const kindStr = asString(m.kind) ?? "adjustment";
            const kind = kindStr as SigilEntry["kind"];

            const delta = asNumber(m.delta) ?? 0;
            const title = asString(m.title);
            const note = asString(m.note);
            const meta = asMeta(m.meta);

            // constrói apenas as chaves presentes para respeitar opcionais
            const entry: SigilEntry = {
                id,
                at,
                kind,
                delta,
                ...(title ? { title } : {}),
                ...(note ? { note } : {}),
                ...(meta ? { meta } : {}),
            };

            return entry;
        })
        .filter((e): e is SigilEntry => e !== null);

    return { balance, cap, recent };
}

export function useSigils() {
    // Buscamos como unknown e normalizamos para lidar com qualquer shape vindo da API
    const { data, error, isLoading, mutate } = useSWR<unknown>(
        "/api/sigils",
        (url) => fetcher<unknown>(url),
        { revalidateOnFocus: false }
    );

    const safe: SigilsPayload = data
        ? normalize(data)
        : { balance: 0, cap: null, recent: [] };

    return {
        sigils: safe,
        isLoading: isLoading && !data,
        error,
        refresh: () => mutate(),
    };
}
