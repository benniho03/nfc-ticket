import { PrismaClient } from "@prisma/client";
import { InferGetServerSidePropsType } from "next";

export async function getServerSideProps(){
    const prisma = new PrismaClient();
    const events = await prisma.event.findMany({
        select: {
            id: true,
            name: true,
            date: true,
            locationAdress: true
        }
    })

    const eventsWithFormattedDate = events.map(event => ({
        ...event,
        date: event.date.toISOString()
    }));

    return { props: { allEventInfo: eventsWithFormattedDate } }
}

export default function Page(allEventInfo: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <>
            <h1>Finde dein Event-Dashboard</h1>
            <p>---------------</p>
            <ul>
                {allEventInfo.allEventInfo.map(event => (
                    <li key={event.id}>
                        <h2>{event.name}</h2>
                        <p>{event.date}</p>
                        <p>{event.locationAdress}</p>
                        <a href={"/admin/dashboard/" + event.id}>Zum Dashboard</a>
                        <p>--------------</p>
                    </li>
                ))}
            </ul>
        </>
    )
}