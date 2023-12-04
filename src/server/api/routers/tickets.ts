import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { ticketSchema } from "./events";
import { TRPCError } from "@trpc/server";

type TicketDetails = z.infer<typeof ticketSchema>;

export const ticketRouter = createTRPCRouter({
    create: publicProcedure
        .input(z.object({ amount: z.number(), eventId: z.string(), userId: z.string() }))
        .mutation(async ({ ctx, input }) => {

            const event = await ctx.db.event.findFirst({
                where: {
                    id: input.eventId,
                },
            });

            if(!input.userId) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "User not found" });

            if (!event) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Event not found" });

            if (event.ticketsSold + input.amount > event.maxTicketAmount)
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Not enough tickets left" });


            await ctx.db.event.update({
                where: {
                    id: input.eventId,
                },
                data: {
                    ticketsSold: event.ticketsSold + input.amount,
                },
            });

            return new Array(input.amount).map(async () => {
                await ctx.db.ticket.create({
                    data: {
                        eventId: input.eventId,
                        price: event.ticketPrice,
                        userId: input.userId,
                    }
                });
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
