"use client";
import type { BookChapter } from "./BookNav";
import { cn } from "@/lib/utils";

type Props = {
    chapters: BookChapter[];
    currentId: string;
    onSelect: (id: string) => void;
};

export default function BookTopNav({ chapters, currentId, onSelect }: Props) {
    return (
        <div className="sticky top-[64px] z-20  border-b border-white/10 bg-black/60 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto px-4 py-2">
                {chapters.map((c) => {
                    const active = c.id === currentId;
                    return (
                        <button
                            key={c.id}
                            onClick={() => onSelect(c.id)}
                            className={cn(
                                "shrink-0 rounded-full px-3 py-1 text-xs",
                                active ? "bg-cyan-700 text-white" : "text-white/70 hover:bg-white/10"
                            )}
                            aria-current={active ? "page" : undefined}
                        >
                            {c.title}
                        </button>
                    );
                })}
            </div>
            <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500/40 via-emerald-400/40 to-amber-400/40" />
        </div>
    );
}
