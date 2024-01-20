import { db } from "@/server/db";
import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";

const requestSchema = z.object({
    ticketId: z.string(),
    eventId: z.string()
})


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.body.API_KEY !== process.env.APP_API_KEY) {
        res.status(403).json({ message: "Auth failed." })
        return
    }

    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Wrong HTTP-method', expected: 'POST' })
        return
    }

    if (req.query.produced) {
        handleTicketProduced(req, res)
        return
    }

    const allUnproducedTickets = await db.ticket.findMany({
        where: {
            status: "OPEN",
            ticketProduced: false
        },
        select: {
            eventId: true,
            id: true,
        }
    })

    res.status(200).json(allUnproducedTickets)

}

function handleTicketProduced(req: NextApiRequest, res: NextApiResponse) {
    if (!validateRequestBody(req.body)) {
        res.status(400).json({ message: 'Invalid format', expected: { tickedId: 'String', eventId: 'String' } })
        return
    }

    const { ticketId, eventId } = req.body;

    db.ticket.update({
        where: {
            id: ticketId,
            eventId: eventId
        },
        data: {
            ticketProduced: true
        }
    })

}

function validateRequestBody(body: any): body is z.infer<typeof requestSchema> {
    return (requestSchema.safeParse(body)).success
}