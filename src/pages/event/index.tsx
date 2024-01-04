import { EventDetails } from "@/server/api/routers/events"
import Link from "next/link"
import { api, truncateText } from "@/utils/api"
import toast from "react-hot-toast"
import { useUser } from "@clerk/nextjs"
import superjson from "superjson"
import { EventSlider } from "@/components/event-slider"
import { db } from "@/server/db"
import { createServerSideHelpers } from "@trpc/react-query/server"
import { appRouter } from "@/server/api/root"



export default function EventOverview() {

    const { data: allEvents, isLoading, error } = api.event.getAll.useQuery()

    if (isLoading) return console.log("Loading?")
    if (error) return <div>An Error Occured</div>

    const { user, isLoaded, isSignedIn } = useUser()

    if (!isSignedIn || !isLoaded || !user) return <div>Not signed in</div>


    if (!allEvents) return <div>No Events found</div>
    return (
        <>
            <div className="max-w-6xl mx-auto">
                <button onClick={() => toast.success("Hi!")}>Click</button>

                <h1>Event Overview</h1>
                <div>{allEvents.length}</div>
                <div className="flex flex-wrap gap-2">
                    {
                        allEvents.map((event) => (
                            <EventDisplay {...event} />
                        ))
                    }
                </div>
            </div>
            <div className="max-w-[40%] mx-auto pt-11">
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
        </>
    )
}

function EventDisplay(event: EventDetails) {

    return (
        <div className="w-1/2 sm:w-1/3 md:w-1/4 flex flex-col border p-2">
            <img
                className="w-full object-cover aspect-video"
                src="https://image.mymixtapez.com/albums/257489/cover/0/large"
                alt={event.name} />
            <span className="font-bold text-center text-2xl">{event.name}</span>
            <p>{truncateText(event.description, 100)}</p>
            <p>Datum: {event.date.toLocaleDateString()}</p>
            <p>Ort: {event.location}</p>
            <div className="w-1/2 rounded text-center px-2 py-1 bg-sky-700 text-white">
                <Link href={`/event/${event.id}`}>
                    Zum Event
                </Link>
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

type SortOptions = "DATE" | "ARTIST"


function sortEvents(events: EventDetails[], sortBy: SortOptions) {
    switch (sortBy) {
        case "DATE":
            return [...events].sort((first, second) => first.date.getTime() - second.date.getTime())
        default:
            return []
    }



}

