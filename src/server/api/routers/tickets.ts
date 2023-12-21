import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { ticketOrder, ticketSchema } from "./events";
import { TRPCError } from "@trpc/server";

type TicketDetails = z.infer<typeof ticketSchema>;

export const ticketRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.db.post.findMany();
    }),
    getLatest: publicProcedure.query(({ ctx }) => {
        return ctx.db.post.findFirst({
            orderBy: { createdAt: "desc" },
        });
    }),
    order: publicProcedure
        .input(ticketOrder)
        .mutation(async ({ ctx, input }) => {
            console.log(input)
            return await Promise.all(input.map(async ticket => {
                try {
                    console.log(ticket.eventId)
                    return await ctx.db.ticket.create({
                        data: {
                            eventId: ticket.eventId,
                            firstname: ticket.firstName,
                            lastname: ticket.lastName
                        }
                    })
                } catch (error) {
                    console.error(error)
                }
            }))
        })
});
