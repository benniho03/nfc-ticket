import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

export const postRouter = createTRPCRouter({
    getLoggedInUser: publicProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
        return
    }
    ),
});
