// src/components/system/SoundHover.tsx
"use client";

import { useRef } from "react";

type Props = {
    children: React.ReactNode;
    onHover?: () => void;
    className?: string;
};

export default function SoundHover({ children, onHover, className }: Props) {
    const armed = useRef(true);

    return (
        <div
            className={className}
            onMouseEnter={() => {
                if (!armed.current) return;
                armed.current = false;
                onHover?.();
                setTimeout(() => (armed.current = true), 300);
            }}
        >
            {children}
        </div>
    );
}
