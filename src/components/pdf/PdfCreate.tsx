import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { z } from 'zod';
import { ticketOrderSchema } from '@/server/api/routers/events';
import { api } from '@/utils/api';
import { db } from '@/server/db';
import Placeholder from "../public/placeholder.jpg";

export type TicketDetails = z.infer<typeof ticketOrderSchema>;

export default async function PdfCreate({ tickets, user }: { tickets: TicketDetails, user: { firstName: string | null, lastName: string | null, email: string } }) {
    // Create styles
    const styles = StyleSheet.create({
        page: {
            display: "flex",
            flexDirection: 'row',
            backgroundColor: 'rgb(15, 23, 42)',
            fontSize: 12
        },
        section: {
            margin: 20,
            padding: 20,
            color: "white",
            top: 200,
        },
        image: {
            width: 173,
            height: 50,
            position: 'absolute',
            right: 30,
            top: 40
        },
        buyer: {
            top: 160,
            color: "white",
            left: 30,
        },
        date: {
            top: 160,
            color: "white",
            right: 100,
            position: "absolute"
        },
        thank: {
            margin: 20,
            padding: 20,
            color: "white",
            top: 200,
            left: -95,
            textAlign: "center",
        },
        end: {
            margin: 20,
            padding: 20,
            color: "white",
            top: 500,
            left: -95,
            textAlign: "center",
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

                <Image style={styles.image} src={"https://i.imgur.com/pGYqewU.png"} />
                <View style={styles.buyer}>
                    <Text>Käuferdetails:</Text>
                    <Text>{user.email}</Text>
                    <Text>{user.firstName} {user.lastName}</Text>
                </View>
                <View style={styles.date}>
                    <Text>{currentDate}</Text>
                </View >
                <View style={styles.thank}>
                    <Text>Vielen Dank für den Kauf deiner Tickets bei Tickety! Wir bedanken uns für dein Vertrauen und wünschen dir ein wunderbares Event mit deinem Lieblingskünstler.</Text>
                </View>
                <View style={styles.section}>
                    {tickets.map((ticket, index) => {
                        return <View style={{
                            top: 90 + (index * 20),
                            color: "white",
                            left: -380,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Text>1x {event?.name} | {event?.date.toLocaleDateString("de-DE", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            })} | {event?.location} | Für: {ticket.firstName} {ticket.lastName} | {event?.ticketPrice}€</Text>
                        </View>
                    })}
                </View>
            </Page>
        </Document>
    );
}
