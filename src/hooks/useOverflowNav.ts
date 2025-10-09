// src/hooks/useOverflowNav.ts
"use client";

import { useEffect, useRef, useState } from "react";

type WithHref = { href: string };

function sameList<A extends WithHref>(a: A[], b: A[]) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i].href !== b[i].href) return false;
    }
    return true;
}

export function useOverflowNav<T extends WithHref>(items: T[]) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState<T[]>(items);
    const [overflow, setOverflow] = useState<T[]>([]);

    useEffect(() => {
        let raf = 0;

        const recalc = () => {
            const node = ref.current;
            if (!node) return;

            // reserva um espaço p/ botão "+ Mais"
            const max = Math.max(node.clientWidth - 140, 0);
            let used = 0;
            const nextVisible: T[] = [];
            const nextOverflow: T[] = [];

            // heurística baratinha
            for (const it of items) {
                const approx = 44 + Math.min(it.href.length * 3, 80);
                if (used + approx <= max) {
                    nextVisible.push(it);
                    used += approx;
                } else {
                    nextOverflow.push(it);
                }
            }

            // **proteção:** atualiza só se mudou
            setVisible((prev) => (sameList(prev, nextVisible) ? prev : nextVisible));
            setOverflow((prev) => (sameList(prev, nextOverflow) ? prev : nextOverflow));
        };

        // primeira medição (em RAF para evitar jitter inicial)
        raf = requestAnimationFrame(recalc);

        // observa redimensionamentos, mas coalescido em RAF
        const ro = new ResizeObserver(() => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(recalc);
        });
        if (ref.current) ro.observe(ref.current);

        const onResize = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(recalc);
        };
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            window.removeEventListener("resize", onResize);
        };
    }, [items]);

    return { ref, visible, overflow };
}
