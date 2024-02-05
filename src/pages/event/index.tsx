import { EventDetails } from "@/server/api/routers/events"
import Link from "next/link"
import { api, truncateText } from "@/utils/api"
import NavBar from "@/components/header-navigation";
import Footer from "@/components/footer-navigation"
import superjson from "superjson"
import { db } from "@/server/db"
import { createServerSideHelpers } from "@trpc/react-query/server"
import { appRouter } from "@/server/api/root"
import { SelectFilter } from "@/components/filter"
import { useState } from "react"
import LoadingSpinner from "@/components/loading-spinner"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EventOverview() {

    const { data: allEvents, isLoading, error } = api.event.getAll.useQuery()

    const [sortBy, setSortBy] = useState<SortOptions>("DATE")
    const [searchTerm, setSearchTerm] = useState("")

    if (isLoading) return <LoadingSpinner />
    if (error) return <div>An Error Occured</div>

    if (!allEvents.length) return <div>No Events found</div>

    return (
        <>
            <NavBar />
            <div className="max-w-6xl mx-auto mt-3">
                <h1 className="font-black text-8xl text-white mb-5">Event Overview</h1>
                <div className="flex justify-between gap-3 mb-3">
                    <Input onChange={e => setSearchTerm(e.target.value)} className="bg-transparent text-white placeholder:text-slate-200" placeholder="Nach was suchst du?" />
                    <SelectFilter setSortBy={setSortBy} />
                </div>
                <div className="grid grid-cols-4 grid-flow-row gap-4">
                    {
                        sortEvents(allEvents, sortBy).filter(event => event.name.includes(searchTerm)).map((event) => (
                            <EventDisplay {...event} />
                        ))
                    }
                </div>
            </div>
            <Footer />
        </>
    )
}

function EventDisplay(event: EventDetails) {

    return (

        <div className="flex flex-col bg-slate-700 rounded-lg">
            <img
                className="w-full object-cover aspect-video rounded-t-lg"
                src={event.imageUrl}
                alt={event.name} />
            <div className="p-3">
                <span className="uppercase font-bold text-2xl text-slate-50 mt-4 ">{event.name}</span>
                <p className="font-bold text-slate-300">Datum: {event.date.toLocaleDateString()}</p>
                <p className="font-bold text-slate-300">Ort: {event.location}</p>
                <p className="font-bold text-slate-300">Preis: {event.ticketPrice}€</p>
                <p className="text-slate-50 mt-3">{truncateText(event.description, 100)}</p>
                <div className="flex justify-center text-center px-2 py-1 mt-4">
                    <div className="w-3/4">
                        <Link href={`/event/${event.id}`}>
                            <Button className="w-full bg-pink-700 text-white">
                                Zum Event
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>


    )
}

function SortedEventSlider(event: EventDetails) {
    return (<div className="overflow-hidden relative">
        <div className="flex transition ease-out duration-100">
            <p>Event: {event.name}</p>
            <p>Ort: {event.location}</p>
            <p>Datum: {event.date.toLocaleDateString()}</p>
        </div>
    </div>

    )
}

export async function getServerSideProps() {

    const ssr = createServerSideHelpers({
        router: appRouter,
        ctx: {
            db,
            userId: null
        },
        transformer: superjson,
    });



    await ssr.event.getAll.prefetch()


    return {
        props: {
            trpcState: ssr.dehydrate(),
        }
    }
}

export type SortOptions = "DATE" | "PRICE DESC" | "PRICE ASC"


function sortEvents(events: EventDetails[], sortBy: SortOptions) {
    switch (sortBy) {
        case "DATE":
            return [...events].sort((first, second) => first.date.getTime() - second.date.getTime())
        case "PRICE DESC":
            return [...events].sort((first, second) => second.ticketPrice - first.ticketPrice)
        case "PRICE ASC":
            return [...events].sort((first, second) => first.ticketPrice - second.ticketPrice)
        default:
            return []
    }



}

