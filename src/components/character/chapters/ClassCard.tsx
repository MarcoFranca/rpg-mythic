"use client";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Props = {
    title: string;
    image: string;
    selected?: boolean;
    role?: string | null;
    spellcasting?: string | null;
    accentFrom?: string; // "22c55e" (sem #)
    accentTo?: string;
    onClick?: () => void;
};

export default function ClassCard({
                                      title, image, selected, role, spellcasting, accentFrom, accentTo, onClick,
                                  }: Props) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rx = useTransform(y, [-50, 50], [8, -8]);
    const ry = useTransform(x, [-50, 50], [-8, 8]);
    const springRx = useSpring(rx, { stiffness: 150, damping: 12 });
    const springRy = useSpring(ry, { stiffness: 150, damping: 12 });

    const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
    };

    const handleLeave = () => {
        x.set(0); y.set(0);
    };

    return (
        <motion.button
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            onClick={onClick}
            style={{ rotateX: springRx, rotateY: springRy }}
            className={cn(
                "group relative aspect-[3/4] w-full overflow-hidden rounded-2xl border bg-black/40 text-left outline-none",
                "border-white/10 hover:border-white/20 focus-visible:ring-2 focus-visible:ring-cyan-500",
                selected && "border-cyan-400/60 shadow-[0_0_0_2px_rgba(34,211,238,0.25)]"
            )}
            aria-pressed={selected}
        >
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                sizes="(max-width: 768px) 50vw, 25vw"
                priority={false}
            />
            {/* Gradiente temático */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: `linear-gradient(180deg, rgba(${hexToRgb(
                        accentFrom ?? "22c55e"
                    )},0.30) 0%, rgba(${hexToRgb(accentTo ?? "0ea5e9")},0.25) 60%, rgba(0,0,0,0.6) 100%)`,
                }}
            />
            {/* Conteúdo */}
            <div className="absolute inset-0 flex flex-col justify-end p-3">
                <div className="mb-2 flex gap-1">
                    {role && <Badge variant="outline">{role}</Badge>}
                    {spellcasting && <Badge variant="outline">{spellcasting}</Badge>}
                </div>
                <h3 className="text-lg font-semibold drop-shadow">{title}</h3>
            </div>
            {/* Borda brilho ao hover */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/0 transition-all group-hover:ring-white/20" />
        </motion.button>
    );
}

function hexToRgb(hex: string): string {
    const h = hex.replace("#", "");
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
}
