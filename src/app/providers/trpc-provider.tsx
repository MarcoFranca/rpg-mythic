"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import { httpBatchLink } from "@trpc/client";
import { api } from "@/trpc/react";

export default function TRPCProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        api.createClient({
            links: [
                httpBatchLink({
                    url: "/api/trpc",
                    transformer: superjson,     // ✅ COLOQUE AQUI
                    fetch(url, opts) {
                        return fetch(url, { ...opts, credentials: "include" });
                    },
                }),
            ],
        }));

    return (
        <api.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </api.Provider>
    );
}
