import PieChart from "@/components/piechart"
import { api } from "@/utils/api"
import { PrismaClient } from "@prisma/client"
import { useRouter } from "next/router"



export default async function EventDashboard(){
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
            <PieChart label1="Verkaufte Tickets" label2="Unverkaufte Tickets" value1={event.ticketsSold} value2={event.maxTicketAmount - event.ticketsSold} />
            <PieChart label1="Eingecheckt" label2="Verkaufte Tickets" value1={await getCheckedIn(eventId)} value2={event.ticketsSold} />

            <p>Generierter Umsatz: {event.ticketsSold * event.ticketPrice} €</p>
        </>
    )
}

async function getCheckedIn(eventId: string){
    const prisma = new PrismaClient();
    return await prisma.ticket.count({
        where: {
            eventId: eventId,
            status: "CLOSED"
        }
    })
}