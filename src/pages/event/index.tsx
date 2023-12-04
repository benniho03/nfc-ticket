import { api } from "@/utils/api"
import Link from "next/link"

export default function EventOverview() {

    const { data: allEvents, isLoading, error } = api.event.getAll.useQuery()

    if(error) return <div>An Error Occured</div>
    if(isLoading) return <div>Loading...</div>

    return (
        <>
            <h1>Event Overview</h1>
            {
                allEvents.map((event) => (
                    <div key={event.id}>
                        <h1><Link href={`/event/${event.id}`}>{event.name}</Link></h1>
                        <p>{event.description}</p>
                        <p>{event.date.toISOString()}</p>
                        <p>{event.location}</p>
                        <p>{event.locationAdress}</p>
                        <p>{event.ticketPrice}</p>
                        <p>{event.maxTicketAmount}</p>
                    </div>
                ))
            }
        </>
    )
}