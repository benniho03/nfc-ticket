import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { ticketOrderSchema, ticketSchema } from "./events";
import { Resend } from 'resend';
import { api } from "@/utils/api";
import { sendTicketEmail } from "./email";
import { auth, clerkClient, getAuth } from "@clerk/nextjs/server";
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
        .input(ticketOrderSchema)
        .mutation(async ({ ctx, input }) => {

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
            console.log(email)

            if (!email) throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "No email found"
            })

            if (process.env.SEND_EMAIL) sendTicketEmail({ tickets: input, email })

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
