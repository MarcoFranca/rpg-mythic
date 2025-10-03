import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

export const runtime = "nodejs";

const handler = (req: Request) =>
    fetchRequestHandler({
            endpoint: "/api/trpc",
            req,
            router: appRouter,
            createContext: () => createTRPCContext(), // <- sem args
            onError({ error }) {
                    console.error("tRPC error:", error);
            },
    });

export { handler as GET, handler as POST };
