// src/app/(characters)/new/_parts/ui/Primitives.tsx
"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-lg border border-white/10 p-3">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/60">{title}</h4>
            {children}
        </section>
    );
}

export function InfoBlock({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-white/10 p-3">
            <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
            <div className="text-sm">{value}</div>
        </div>
    );
}

export function EmptyText({ text = "—" }: { text?: string }) {
    return <p className="text-sm text-white/60">{text}</p>;
}

export function SkeletonLine({ lines = 2 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full bg-white/10" />
            ))}
        </div>
    );
}

export function SkeletonBullets({ count = 3 }: { count?: number }) {
    return (
        <ul className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
                <li key={i}>
                    <Skeleton className="h-4 w-3/4 bg-white/10" />
                </li>
            ))}
        </ul>
    );
}
