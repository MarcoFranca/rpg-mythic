"use client";
import { CheckCircle2, Circle, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type BookChapter = {
    id: string;
    title: string;
    description: string;
    completed?: boolean;
    icon?: LucideIcon;
};

type BookNavProps = {
    chapters: BookChapter[];
    currentId: string;
    onSelect: (id: string) => void;
};

export default function BookNav({ chapters, currentId, onSelect }: BookNavProps) {
    return (
        <nav className="p-4">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-white/70">
                Capítulos do Cântico
            </h2>
            <ol className="space-y-2">
                {chapters.map((c) => {
                    const Icon = c.icon;
                    const active = c.id === currentId;
                    const done = Boolean(c.completed);
                    return (
                        <li key={c.id}>
                            <Button
                                variant={active ? "default" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3",
                                    active ? "bg-cyan-700 hover:bg-cyan-700" : "hover:bg-white/5"
                                )}
                                onClick={() => onSelect(c.id)}
                            >
                                {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                                {Icon && <Icon className="h-4 w-4 opacity-80" />}
                                <div className="text-left">
                                    <div className="text-sm font-medium">{c.title}</div>
                                    <div className="text-xs text-white/60">{c.description}</div>
                                </div>
                            </Button>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
