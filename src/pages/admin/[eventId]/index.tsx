import HeaderNavigation from "@/components/header-navigation"
import PieChart from "@/components/piechart"
import { UsersTable } from "@/components/users-table"
import { api } from "@/utils/api"
import { BanknotesIcon, CalendarIcon, MapIcon, MapPinIcon } from "@heroicons/react/24/outline"
import { PrismaClient } from "@prisma/client"
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router"


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const eventId = context.query.eventId as string
    const prisma = new PrismaClient();
    const cCount = await prisma.ticket.count({
        where: {
            eventId: eventId,
            status: "CLOSED"
        }
    })
    const oCount = await prisma.ticket.count({
        where: {
            eventId: eventId,
            status: "OPEN"
        }
    })
    const users = await prisma.ticket.findMany({
        where: {
            eventId: eventId
        },
        select: {
            id: true,
            status: true,
            firstname: true,
            lastname: true,
        }
    })
    return { props: { closedCount: cCount, openCount: oCount, users } }
}

export default function EventDashboard({ closedCount, openCount, users }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    const eventId = router.query.eventId as string
    const { data: event, isLoading, error } = api.event.getOne.useQuery({ eventId })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>An Error Occured</div>
    if (!event) return <div>404</div>

    return (
        <div>
            <HeaderNavigation />
            <div className="container mt-3 text-slate-50">
                <h1 className="text-3xl font-bold mb-3">{event.name}</h1>
                <div className="mb-3">
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-center">
                            <MapPinIcon className="h-5 w-5 inline-block text-slate-50" />
                            <p className="text-slate-200">{event.location}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <CalendarIcon className="h-5 w-5 inline-block text-slate-50" />
                            <p className="text-slate-200">{event.date.toLocaleString('de-DE', { day: 'numeric', month: '2-digit', year: 'numeric' })}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <BanknotesIcon className="h-5 w-5 inline-block text-slate-50" />
                            <p className="text-slate-200">{event.ticketPrice}€</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <MapIcon className="h-5 w-5 inline-block text-slate-50" />
                            <p className="text-slate-200">{event.locationAdress}</p>
                        </div>
                    </div>
                </div>
                <div className="mb-3" style={{ width: '250px' }}>
                    <PieChart label1="Verkaufte Tickets" label2="Unverkaufte Tickets" value1={event.ticketsSold} value2={event.maxTicketAmount - event.ticketsSold} />
                    {
                        (openCount != 0 && closedCount != 0) ? (
                            <PieChart label1="Eingecheckt" label2="Noch nicht eingecheckt" value1={closedCount} value2={openCount} />
                        ) : null
                    }
                </div>

                <p className="mb-3">Generierter Umsatz: <span className="font-bold">
                    {event.ticketsSold * event.ticketPrice} €
                </span></p>

                <p className="text-2xl font-bold">Teilnehmerliste</p>
                <UsersTable users={users} />

            </div>
        </div>
    )
}