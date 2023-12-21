import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const ticketSchema = z.object({
    id: z.string(),
    eventId: z.string(),
    price: z.number(),
});

const eventSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    date: z.date(),
    location: z.string(),
    locationAdress: z.string(),
    ticketPrice: z.number(),
    maxTicketAmount: z.number(),
    ticketsSold: z.number(),
    imageUrl: z.string(),
});

export type EventDetails = z.infer<typeof eventSchema>;

const createEventInputSchema = z.object({
    name: z.string(),
    description: z.string(),
    date: z.date(),
    location: z.string(),
    locationAdress: z.string(),
    ticketPrice: z.number(),
    maxTicketAmount: z.number(),
    imageUrl: z.string(),
});

export const eventRouter = createTRPCRouter({
    create: publicProcedure
        .input(createEventInputSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.event.create({
                data: {
                    name: input.name,
                    description: input.description,
                    date: input.date,
                    location: input.location,
                    locationAdress: input.locationAdress,
                    ticketPrice: input.ticketPrice,
                    maxTicketAmount: input.maxTicketAmount,
                    ticketsSold: 0,
                    imageUrl: input.imageUrl
                }
            })
        }),
    getOne: publicProcedure
        .input(z.object({ eventId: z.string() }))
        .query(async ({ ctx, input }) => {

            if(!input.eventId) return

            return await ctx.db.event.findFirst({
                where: {
                    id: input.eventId,
                },
            })
        }),    
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.db.event.findMany({
            take: 10
        });
    }),
    getLatest: publicProcedure.query(({ ctx }) => {
        return ctx.db.post.findFirst({
            orderBy: { createdAt: "desc" },
        });
    }),
});




