import "./globals.css";
import Providers from "./providers";           // seu TRPC/ReactQuery
import { ThemeProvider } from "@/components/theme/theme-provider";

export const metadata = { title: "RPG System — Guia Mítico" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
        <body>
        <ThemeProvider>
            <Providers>{children}</Providers>
        </ThemeProvider>
        </body>
        </html>
    );
}
