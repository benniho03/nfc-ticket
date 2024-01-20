import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

type ResponseData = SuccessfulValidation | InvalidUserInput | WrongHttpReq | NoTicketFound

type SuccessfulValidation = {
    message: string,
    name: string,
    status: string
}

type InvalidUserInput = {
    message: string;
    expected: Record<string, string>,
}

type WrongHttpReq = {
    message: string;
    expected: 'POST'
}

type NoTicketFound = {
    message: string;
}


type TicketInfo = z.infer<typeof ticketInfoSchema>

const ticketInfoSchema = z.object({
    ticketId: z.string(),
    eventId: z.string()
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Wrong HTTP-method', expected: 'POST' })
        return
    }

    if (!checkUserInput(req.body)) {
        res.status(400).json({ message: 'Invalid format', expected: { tickedId: 'String', eventId: 'String' } })
        return
    }

    const { ticketId, eventId } = req.body;

    const ticket = await getTicketInfo(ticketId, eventId)
    if (!ticket) {
        res.status(400).json({ message: 'Ticket doesnt exsits' });
        return
    }

    if (ticket.status == "CLOSED") {
        res.status(200).json({ message: 'Ticket already used', name: `${ticket.firstname} ${ticket.lastname}`, status: ticket.status })
        return
    }

    if (ticket.status == "CANCELLED") {
        res.status(200).json({ message: 'Ticket is cancelled', name: `${ticket.firstname} ${ticket.lastname}`, status: ticket.status })
        return
    }

    // läuft nur so weit, wenn ticket OPEN ist
    res.status(200).json({ message: 'Valid ticket', name: `${ticket.firstname} ${ticket.lastname}`, status: ticket.status })
    // status in DB muss auf Closed gesetzt werden
    ticketUsed(ticket.id, ticket.eventId)
}

function checkUserInput(userInput: unknown): userInput is TicketInfo {
    return ticketInfoSchema.safeParse(userInput).success;
}

async function getTicketInfo(ticketId: string, eventId: string) {
    const prisma = new PrismaClient();
    return await prisma.ticket.findFirst({
        where: {
            id: ticketId,
            eventId: eventId
        }
    });
}

async function ticketUsed(ticketId: string, eventId: string) {
    const prisma = new PrismaClient();
    await prisma.ticket.update({
        where: {
            id: ticketId,
            eventId: eventId
        },
        data: {
            status: 'CLOSED'
        }
    });
}