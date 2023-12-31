import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { ticketOrderSchema, ticketSchema } from "./events";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";
import { sendTicketEmail } from "./email";

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
        .input(ticketOrderSchema.min(1))
        .mutation(async ({ ctx, input }) => {
          
            const ticketAmount = await ctx.db.event.findFirst({
                where: {
                    id: input[0]?.eventId
                },
                select: {
                    ticketsSold: true,
                    maxTicketAmount: true
                }
            })
            if (!ticketAmount) {
                throw new TRPCError({ message: "no ticketsSold", code: "INTERNAL_SERVER_ERROR" })
            }
            if (ticketAmount.ticketsSold >= ticketAmount.maxTicketAmount) {
                throw new TRPCError({ message: "no more tickets available", code: "BAD_REQUEST" })
            }
          
            await ctx.db.event.update({
                data: {
                    ticketsSold: ticketAmount.ticketsSold + input.length
                },
                where: {
                    id: input[0]?.eventId
                }
            })

            if (!ctx.userId) throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You need to be logged in to order tickets"
            })

            const user = await clerkClient.users.getUser(ctx.userId)

            if (!user) throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You need to be logged in to order tickets"
            })


            const email = user.emailAddresses[0]?.emailAddress

            if (!email) throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "No email found"
            })

            if (process.env.SEND_EMAIL) void sendTicketEmail({ tickets: input, email })

            return await Promise.all(input.map(async ticket => {
                try {
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
