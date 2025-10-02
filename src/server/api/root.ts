import { createTRPCRouter } from "./trpc";
import { itemRouter } from "@/server/api/routers/item";

export const appRouter = createTRPCRouter({
    item: itemRouter,
});

export type AppRouter = typeof appRouter;
