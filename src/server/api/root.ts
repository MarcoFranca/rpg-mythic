import { router } from "./trpc";
import { itemRouter } from "./routers/item";
import { tablesRouter } from "./routers/tables";
import { meRouter } from "./routers/me";
import { itemsListRouter } from "./routers/items.list";
import {userRouter} from "@/server/api/routers/user";
import {characterSheetRouter} from "@/server/routers/character.sheet";
import {characterCreateRouter} from "@/server/routers/character.create";

export const appRouter = router({
    item: itemRouter,
    user: userRouter,
    characterSheet: characterSheetRouter,
    characterCreate: characterCreateRouter,
    tables: tablesRouter,
    me: meRouter,
    itemsList: itemsListRouter, // ou mescle no itemRouter
});

export type AppRouter = typeof appRouter;
