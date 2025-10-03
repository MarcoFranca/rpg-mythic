import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const tablesRouter = router({
    listPublic: publicProcedure.query(({ ctx }) =>
        ctx.prisma.gameTable.findMany({
            where: { visibility: "public" },
            include: { memberships: true },
            orderBy: { createdAt: "desc" },
        })
    ),

    byId: publicProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(({ ctx, input }) =>
            ctx.prisma.gameTable.findUnique({           // <- gameTable
                where: { id: input.id },
                include: { memberships: true, sessions: true },
            })
        ),
});
