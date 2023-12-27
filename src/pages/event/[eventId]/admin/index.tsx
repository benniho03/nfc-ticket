import { api } from "@/utils/api"
import { useRouter } from "next/router"

export default function EventDashboard(){
    const router = useRouter()
    const eventId = router.query.eventId as string
    const { data: event, isLoading, error } = api.event.getOne.useQuery({ eventId })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>An Error Occured</div>
    if (!event) return <div>404</div>

    return (
        <>
            <h1>Admin Dashboard</h1>
            <h2>{event.name}, {event.date.toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric'})}</h2>
            <h2>{event.location}, {event.locationAdress}</h2>


            <p>Generierter Umsatz: {event.ticketsSold * event.ticketPrice} €</p>
        </>
    )
}