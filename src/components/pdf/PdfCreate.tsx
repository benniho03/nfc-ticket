import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { z } from 'zod';
import { ticketOrderSchema } from '@/server/api/routers/events';
import { api } from '@/utils/api';
import { db } from '@/server/db';

export type TicketDetails = z.infer<typeof ticketOrderSchema>;

export default async function PdfCreate({ tickets, user }: { tickets: TicketDetails, user: { firstName: string | null, lastName: string | null, email: string } }) {
    // Create styles
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#E4E4E4'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        }
    });

    const event = await db.event.findFirst({ where: { id: tickets[0]!.eventId } })


    const currentDate = new Date().toLocaleDateString("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    const currentTime = new Date().toLocaleTimeString()

    // Create Document Component
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {tickets.map((ticket) => {
                    return <View style={styles.section}>
                        <Text>{event?.name} {user.firstName} {user.lastName} {user.email} </Text>
                        <Text>{event?.name} {ticket.firstName} {ticket.lastName}</Text>
                        <Text>{currentDate}</Text>
                        <Text>{currentTime}</Text>
                    </View>
                })}

                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    );
}
