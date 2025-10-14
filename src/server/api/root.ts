import { router } from "./trpc";
import { itemRouter } from "./routers/item";
import { tablesRouter } from "./routers/tables";
import { meRouter } from "./routers/me";
import { itemsListRouter } from "./routers/items.list";
import {userRouter} from "@/server/api/routers/user";
import {characterSheetRouter} from "@/server/routers/character.sheet";
import {characterCreateRouter} from "@/server/routers/character.create";
import {classCatalogRouter} from "@/server/api/routers/catalog/class";
import { subclassCatalogRouter } from "./routers/catalog/subclass";
import { nameRouter } from "./routers/name";

export const appRouter = router({
    item: itemRouter,
    user: userRouter,
    characterSheet: characterSheetRouter,
    characterCreate: characterCreateRouter,
    class: classCatalogRouter,
    subclassCatalog: subclassCatalogRouter, // ⬅️ exponha aqui
    name: nameRouter,
    tables: tablesRouter,
    me: meRouter,
    itemsList: itemsListRouter, // ou mescle no itemRouter
    catalog: router({
        class: classCatalogRouter,
    }),
    classCatalog: classCatalogRouter,
});

export type AppRouter = typeof appRouter;
