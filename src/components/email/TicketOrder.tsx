import { ticketOrderSchema } from "@/server/api/routers/events";
import { z } from "zod";
import { Container, Button, Heading, Text } from '@react-email/components'
import { api } from "@/utils/api";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";


export default async function TicketOrder({ tickets }: { tickets: z.infer<typeof ticketOrderSchema> }) {

    const event = await db.event.findFirst({
        where: {
            id: tickets[0]!.eventId
        }
    })

    if (!event) throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong"
    })

    return (
        <Container>
            <Heading as="h1">{event.name}</Heading>
            <Heading as="h3">Vielen Dank für deine Bestellung!</Heading>
            {
                tickets.map((ticket, index) => {
                    return (
                        <Text key={index}>{index + 1}. {ticket.firstName} {ticket.lastName}</Text>
                    )
                })
            }
        </Container>
    )
}