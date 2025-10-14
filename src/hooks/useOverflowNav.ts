// src/hooks/useOverflowNav.ts
"use client";

import { useEffect, useRef, useState } from "react";

type WithHref = { href: string };

function sameList<A extends WithHref>(a: A[], b: A[]) {
    return a.length === b.length && a.every((ai, i) => ai.href === b[i]!.href);
}

export function useOverflowNav<T extends WithHref>(items: T[]) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState<T[]>(items);
    const [overflow, setOverflow] = useState<T[]>([]);

    useEffect(() => {
        // evita rodar em SSR
        if (typeof window === "undefined") return;

        let rafId = 0;

        const recalc = () => {
            const node = ref.current;
            if (!node) return;

            // reserva espaço pro botão “+ Mais”
            const max = Math.max((node.clientWidth ?? 0) - 140, 0);
            let used = 0;
            const nextVisible: T[] = [];
            const nextOverflow: T[] = [];

            for (const it of items) {
                const approx = 44 + Math.min(it.href.length * 3, 80);
                if (used + approx <= max) {
                    nextVisible.push(it);
                    used += approx;
                } else {
                    nextOverflow.push(it);
                }
            }

            setVisible((prev) => (sameList(prev, nextVisible) ? prev : nextVisible));
            setOverflow((prev) => (sameList(prev, nextOverflow) ? prev : nextOverflow));
        };

        // primeira medição (coalescida no RAF)
        rafId = window.requestAnimationFrame(recalc);

        // Tipagem segura do ResizeObserver sem usar `any`
        type ROConstructor = new (callback: ResizeObserverCallback) => ResizeObserver;
        const RO: ROConstructor | undefined = (globalThis as {
            ResizeObserver?: ROConstructor;
        }).ResizeObserver;

        const ro = RO
            ? new RO(() => {
                cancelAnimationFrame(rafId);
                rafId = window.requestAnimationFrame(recalc);
            })
            : null;

        const el = ref.current;
        if (ro && el) ro.observe(el);

        const onResize = () => {
            cancelAnimationFrame(rafId);
            rafId = window.requestAnimationFrame(recalc);
        };
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(rafId);
            ro?.disconnect();
            window.removeEventListener("resize", onResize);
        };
    }, [items]);

    return { ref, visible, overflow };
}
