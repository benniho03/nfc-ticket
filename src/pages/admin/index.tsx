import NavBar from "@/components/header-navigation";
import { Button } from "@/components/ui/button";
import { db } from "@/server/db";
import { InferGetServerSidePropsType } from "next";
import Link from "next/link";

export async function getServerSideProps() {
    const events = await db.event.findMany({
        select: {
            id: true,
            name: true,
            date: true,
            locationAdress: true
        }
    })

    const eventsWithFormattedDate = events.map(event => ({
        ...event,
        date: event.date.toLocaleDateString()
    }));

    return { props: { allEventInfo: eventsWithFormattedDate } }
}

export default function Page({ allEventInfo }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <>
            <NavBar />
            <div className="container">
                <h1 className="font-bold text-white text-3xl my-3">Zu welchem Event möchtest du?</h1>
                <ul className="grid grid-cols-4 gap-3 text-white">
                    {allEventInfo.map(event => (
                        <Link href={"/admin/dashboard/" + event.id}>
                            <li className="flex flex-col gap-1 border border-slate-200 p-4 rounded" key={event.id}>
                                <h2>{event.name}</h2>
                                <p>{event.date}</p>
                                <p>{event.locationAdress}</p>
                            </li>
                        </Link>
                    ))}
                </ul>
                <div className="mt-5">
                    <p className="text-white font-bold text-3xl">Neues Event erstellen?</p>
                    <Button className="mt-3 bg-pink-700">
                        <Link href={"/event/create"}>Neues Event</Link>
                    </Button>
                </div>
            </div>
        </>
    )
}