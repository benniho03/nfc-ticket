import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return prisma.post.create({
        data: {
          name: input.name,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany();
  }),
  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
});
