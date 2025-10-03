import { router, publicProcedure } from "../trpc";

export const meRouter = router({
    profile: publicProcedure.query(({ ctx }) => {
        // ajuste aqui se tiver auth/Supabase no ctx
        return { ok: true };
    }),
});
