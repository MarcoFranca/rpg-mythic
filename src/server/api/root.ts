import { router } from "./trpc";
import { itemRouter } from "./routers/item";
import { tablesRouter } from "./routers/tables";
import { meRouter } from "./routers/me";
import { itemsListRouter } from "./routers/items.list"; // opcional

export const appRouter = router({
    item: itemRouter,
    tables: tablesRouter,
    me: meRouter,
    itemsList: itemsListRouter, // ou mescle no itemRouter
});

export type AppRouter = typeof appRouter;
