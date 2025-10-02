"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const current = theme === "system" ? systemTheme : theme;
    if (!mounted) return null; // evita flicker no SSR

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setTheme(current === "dark" ? "light" : "dark")}>
                {current === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setTheme("system")}>
                Sistema
            </Button>
        </div>
    );
}
