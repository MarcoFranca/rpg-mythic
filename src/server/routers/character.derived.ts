import { router, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { AttributesBlock, AttributesBlockT } from "@/server/zod/character-blocks";
import { recomputeSnapshot } from "@/server/services/character.service";

export const characterDerivedRouter = router({
    saveAttributesAndSnapshot: protectedProcedure
        .input(z.object({ id: z.string().uuid(), attributes: AttributesBlock }))
        .mutation(async ({ ctx, input }) => {
            const attrs = input.attributes as AttributesBlockT;

            await ctx.prisma.character.update({
                where: { id: input.id, userId: ctx.user.id },
                data: { attributes: attrs },
            });

            const snapshot = await recomputeSnapshot(ctx.prisma, input.id);
            return { ok: true, snapshot };
        }),
});
