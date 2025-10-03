import { router, publicProcedure } from "../trpc";

export const meRouter = router({
    profile: publicProcedure.query(() => ({ ok: true })),
});



