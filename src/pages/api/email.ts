import { ticketOrderSchema } from "@/server/api/routers/events";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { z } from "zod";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'POST') return res.status(405).json({ message: 'Wrong HTTP-method', expected: 'POST' })

    const { data, error } = await sendEmail({
        email: "ben.holderle.21@lehre.mosbach.dhbw.de",
        tickets: [{
            eventId: "123",
            firstName: "Benni",
            lastName: "Holderle"
        }]
    })


    if (!data || error) return res.status(500).json({ message: "Couldn't send the email", error })


    res.status(200).json({ message: "E-Mail successfully sent.", data, error });
}

type TicketOrderForEmail = {
    email: string,
    tickets: z.infer<typeof ticketOrderSchema>
}


export async function sendEmail(order: TicketOrderForEmail) {
    const resend = new Resend(process.env.RESEND_API_KEY)

    return await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [order.email],
        subject: 'Your tickets',
        html: `<p>Thank you for your order!</p>
        <p>Here are your tickets:</p>
        <ul>
            ${order.tickets.map(ticket => `<li>${ticket.firstName} ${ticket.lastName} </li>`)}
        </ul>`
    })
}
