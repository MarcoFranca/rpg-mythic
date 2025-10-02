"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"        // aplica 'dark' como classe no <html>
            defaultTheme="system"    // segue o SO por padrão
            enableSystem             // habilita auto (prefers-color-scheme)
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    );
}
