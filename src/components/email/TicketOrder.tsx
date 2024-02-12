import { ticketOrderSchema } from "@/server/api/routers/events";
import { z } from "zod";
import { Container, Button, Heading, Text, Tailwind, Section, Img, Column, Row, Hr } from '@react-email/components'
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
        <Tailwind>
            <Container className="bg-slate-900 p-4 text-slate-50 max-w-4xl">
                <Section className="flex justify-center p-3 w-full">
                    <Img className="w-1/4 object-contain" src={"https://nfc-ticket-one.vercel.app/logo.png"} alt={"Tickety"} />
                </Section>
                <Text>Hallo {tickets[0]?.firstName}!</Text>
                <Text>Hier sind deine bestellten Tickets.</Text>
                <Hr color="lightgrey" />
                <Row className="flex mt-3">
                    <Column className="flex flex-col gap-y-2 items-start w-2/3">
                        {
                            tickets.map((ticket, index) => {
                                return (
                                    <Section key={ticket.firstName + ticket.lastName}
                                        className="flex flex-row px-2 py-1 bg-slate-300 rounded text-slate-950">
                                        <Text className="inline font-bold mr-3">{index + 1}.</Text>
                                        <Text className="inline font-bold mr-3">{ticket.firstName} {ticket.lastName}</Text>
                                        <Text className="inline font-bold mr-3">{event.ticketPrice} €</Text>
                                    </Section>
                                )
                            })
                        }
                    </Column>
                    <Column className="w-1/3">
                        <Text className="text-slate-50 font-bold">{event.name}</Text>
                        <Text className="text-slate-50">{event.location}</Text>
                        <Text className="text-slate-300">{event.locationAdress}</Text>
                        <Img src={event.imageUrl} alt={event.name} className="w-full object-cover" />
                        <Text>{event.name}</Text>
                        <Text>{event.description}</Text>
                    </Column>
                </Row>
            </Container>
        </Tailwind>
    )
}