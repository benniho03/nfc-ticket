import { EventDetails } from "@/server/api/routers/events"
import Link from "next/link"
import { api, truncateText } from "@/utils/api"
import toast from "react-hot-toast"
import { useUser } from "@clerk/nextjs"
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { EventSlider } from "@/components/event-slider"
import NavBar from "@/components/header-navigation";
import Footer from "@/components/footer-navigation"
import superjson from "superjson"
import { db } from "@/server/db"
import { createServerSideHelpers } from "@trpc/react-query/server"
import { appRouter } from "@/server/api/root"
import { SelectFilter } from "@/components/filter"
import { useState } from "react"

export default function EventOverview() {

    const { data: allEvents, isLoading, error } = api.event.getAll.useQuery()

    const [sortBy, setSortBy] = useState<SortOptions>("DATE")

    if (isLoading) return console.log("Loading?")
    if (error) return <div>An Error Occured</div>

    const { user, isLoaded, isSignedIn } = useUser()

    if (!isSignedIn || !isLoaded || !user) return <div>Not signed in</div>


    if (!allEvents) return <div>No Events found</div>
    return (
        <>

            <div className="max-w-6xl mx-auto mt-11">


                <NavBar />

                <button onClick={() => toast.success("Hi!")}>Click</button>

                <h1 className="font-black text-8xl">Event Overview</h1>
                <SelectFilter setSortBy={setSortBy} />
                <div className="flex flex-wrap gap-5">
                    {
                        sortEvents(allEvents, sortBy).map((event) => (
                            <EventDisplay {...event} />
                        ))
                    }
                </div>
            </div>

            <div className="max-w-[40%] mx-auto pt-11 ">
                <div className="flex flex-wrap gap-2">
                    <EventSlider events={sortEvents(allEvents, "DATE")} />
                    {

                        //     sortEvents(allEvents, "DATE").map((event) => (
                        //         // <SortedEventSlider {...event} />
                        //         <EventSlider{...event}/>
                        //     ))
                    }
                </div>
            </div>
            <Footer />
        </>
    )
}

function EventDisplay(event: EventDetails) {

    return (

        <div className="w-1/2 sm:w-1/3 md:w-1/4 flex flex-col  bg-slate-700">
            <img
                className="w-full object-cover aspect-video"
                src="https://image.mymixtapez.com/albums/257489/cover/0/large"
                alt={event.name} />
            <div className="p-3">
                <span className="uppercase font-bold text-2xl text-slate-50 mt-4 ">{event.name}</span>
                <p className="font-bold text-slate-300">Datum: {event.date.toLocaleDateString()}</p>
                <p className="font-bold text-slate-300">Ort: {event.location}</p>
                <p className="font-bold text-slate-300">Price: {event.ticketPrice}</p>
                <p className="text-slate-50 mt-3">{truncateText(event.description, 100)}</p>
                <div className="w-1/2 rounded text-center px-2 py-1 bg-pink-700 text-white mt-4">
                    <Link href={`/event/${event.id}`}>
                        Zum Event
                    </Link>
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
            db
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

