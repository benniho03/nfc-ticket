import HeaderNavigation from "@/components/header-navigation";
import { Button } from "@/components/ui/button";
import { db } from "@/server/db";
import { truncateText } from "@/utils/api";
import { BanknotesIcon, CalendarIcon, MapPinIcon, PlusIcon } from "@heroicons/react/24/outline";
import { InferGetServerSidePropsType } from "next";
import Link from "next/link";

export async function getServerSideProps() {
    const events = await db.event.findMany({
        select: {
            id: true,
            name: true,
            date: true,
            location: true,
            imageUrl: true,
            ticketPrice: true,
            description: true
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
            <HeaderNavigation />
            <div className="container">
                <h1 className="font-bold text-white text-3xl my-3">Zu welchem Event möchtest du?</h1>
                <div className="my-5">
                    <Button className="mt-3 bg-pink-700 flex items-center gap-2">
                        <PlusIcon className="h-5 w-5 inline-block text-white" />
                        <Link href={"/event/create"}>Neues Event</Link>
                    </Button>
                </div>
                <ul className="grid grid-cols-4 gap-3 text-white">
                    {
                        allEventInfo.map(event => (
                            <div className="flex flex-col bg-slate-700 rounded-lg">
                                <img
                                    className="w-full object-cover aspect-video rounded-t-lg"
                                    src={event.imageUrl}
                                    alt={event.name} />
                                <div className="p-3 flex flex-col gap-1 justify-between h-full">
                                    <span className="uppercase font-bold text-2xl text-slate-50 mb-2">{event.name}</span>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex gap-2 items-center">
                                            <MapPinIcon className="h-5 w-5 inline-block text-slate-50" />
                                            <p className="text-slate-200">{event.location}</p>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <CalendarIcon className="h-5 w-5 inline-block text-slate-50" />
                                            <p className="text-slate-200">{event.date}</p>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <BanknotesIcon className="h-5 w-5 inline-block text-slate-50" />
                                            <p className="text-slate-200">{event.ticketPrice}€</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <p className="text-slate-50 mt-3">{truncateText(event.description, 100)}</p>
                                    </div>
                                    <div className="flex justify-center text-center mt-2 ">
                                        <div className="w-full">
                                            <Link href={`/admin/${event.id}`}>
                                                <Button className="w-full bg-pink-700 text-white">
                                                    Zum Event
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </ul>
            </div>
        </>
    )
}