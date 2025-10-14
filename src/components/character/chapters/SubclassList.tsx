"use client";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import * as React from "react";

type Props = {
    classId: string;             // aceita uuid ou slug; já tratamos no router
    onPick?: (subclass: {
        id: string;
        classId: string;
        name: string;
        description: string;
        aliases: string[];
    }) => void;
};

export default function SubclassList({ classId, onPick }: Props) {
    const { data, isLoading, error } = api.subclassCatalog.listByClass.useQuery({ classId });

    if (isLoading) {
        return (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-28 animate-pulse rounded-xl bg-white/5" />
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-sm text-red-300">Falha ao carregar subclasses: {error.message}</div>;
    }

    const subs = data ?? [];
    if (!subs.length) {
        return (
            <div className="flex items-center gap-2 text-sm text-white/70">
                <Info className="h-4 w-4" />
                Nenhuma subclasse cadastrada para esta classe.
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {subs.map((s) => (
                <Card key={s.id} className="bg-white/5 backdrop-blur">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">{s.name}</CardTitle>
                        <div className="mt-1 flex flex-wrap gap-1">
                            {s.aliases.map((al) => (
                                <Badge key={al} variant="outline">{al}</Badge>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="line-clamp-3 text-sm text-white/70">{s.description}</p>
                        <div className="mt-3 flex items-center gap-2">
                            <Button size="sm" onClick={() => onPick?.(s)}>
                                Escolher {s.name}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
