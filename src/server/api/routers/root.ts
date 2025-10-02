import { createTRPCRouter } from "./trpc";
import { itemRouter } from "./routers/item";

export const appRouter = createTRPCRouter({
    item: itemRouter,
});

export type AppRouter = typeof appRouter;
