"use client";

import useSWR from "swr";
import type { SigilsPayload } from "./types";

const fetcher = (url: string) => fetch(url).then((r) => {
    if (!r.ok) throw new Error("Failed fetch: " + url);
    return r.json();
});

export function useSigils() {
    const { data, error, isLoading, mutate } = useSWR<SigilsPayload>("/api/sigils/me", fetcher, {
        revalidateOnFocus: false,
    });

    return {
        sigils: data ?? { balance: 0, cap: undefined, recent: [] },
        isLoading,
        isError: !!error,
        refresh: mutate,
    };
}
