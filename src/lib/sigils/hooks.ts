// src/lib/sigils/hooks.ts  ✅
"use client";
import useSWR from "swr";
import type { SigilsPayload, SigilEntry } from "@/types/sigils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function normalize(payload: unknown): SigilsPayload {
    const p = (payload ?? {}) as Partial<SigilsPayload> & { recent?: any[] };

    const recent: SigilEntry[] = (p.recent ?? []).map((m: any) => ({
        id: String(m.id),
        at: String(m.at ?? m.createdAt ?? new Date().toISOString()),
        kind: (m.kind ?? "adjustment") as SigilEntry["kind"],
        delta: Number(m.delta ?? 0),
        title: m.title ? String(m.title) : undefined,
        note: m.note ? String(m.note) : undefined,
        meta: m.meta as Record<string, unknown> | undefined,
    }));

    return {
        balance: Number(p.balance ?? 0),
        cap: p.cap ?? null,
        recent,
    };
}

export function useSigils() {
    const { data, error, isLoading, mutate } = useSWR<SigilsPayload>("/api/sigils", fetcher, {
        revalidateOnFocus: false,
    });

    const safe = data ? normalize(data) : { balance: 0, cap: null, recent: [] };

    return {
        sigils: safe,
        isLoading: isLoading && !data,
        error,
        refresh: () => mutate(),
    };
}
