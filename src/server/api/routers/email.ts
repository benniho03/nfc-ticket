import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Resend } from "resend";
import { ticketOrderSchema } from "./events";
import { render, renderAsync } from "@react-email/components";
import TicketOrder from "@/components/email/TicketOrder";
import fs from "fs/promises";
import path from "path";

export const emailRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
});


export const sendTicketEmail = async ({ tickets, email, pdfBuffer }: { tickets: z.infer<typeof ticketOrderSchema>, email: string, pdfBuffer: Buffer }) => {
  const { data, error } = await sendEmail({
    recipient: email,
    tickets,
    pdfBuffer
  })

  if (error || !data) throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: error?.message
  })

  return {
    message: "E-Mail successfully sent.",
    data,
    error
  }

}

export async function sendEmail(order: { recipient: string, tickets: z.infer<typeof ticketOrderSchema>, pdfBuffer: Buffer }) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  return await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    // Hier sollte nachher eigentlich der User stehen, können aber nicht an Nutzer schicken, ohne Mail Server :(
    // to: [order.recipient],
    to: 'ben.holderle.21@lehre.mosbach.dhbw.de',
    subject: 'Your tickets',
    html: await renderAsync(await TicketOrder({
      tickets: order.tickets
    })),
    attachments: [{ filename: "Deine_Bestellung.pdf", content: order.pdfBuffer }]
  })
}
