import { EventDetails } from "@/server/api/routers/events";
import { api } from "@/utils/api";
import { SignInButton, auth, useUser } from "@clerk/nextjs";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function Page() {
    const router = useRouter()
    const eventId = router.query.eventId as string

    const { user, isSignedIn } = useUser()
    if (!user || !isSignedIn) return <div><SignInButton /></div>
    const userId = user?.id

    const { data: event, isLoading, error } = api.event.getOne.useQuery({ eventId })

    if (!userId) return <div>Not signed in</div>

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>An Error Occured</div>
    if (!event) return <div>404</div>


    return (
        <>
            <h1>{event.name}</h1>
            <p>{event.description}</p>
            <p>{event.date.toISOString()}</p>
            <p>{event.location}</p>
            <p>{event.locationAdress}</p>
            <p>{event.ticketPrice}</p>
            <p>{event.maxTicketAmount}</p>
        </>
    )
}

function getRemainingTicketPercentage(maxTicketAmount: number, ticketsSold: number) {
    if (ticketsSold === 0) return 100
    return (1 - (maxTicketAmount / ticketsSold) * 100).toFixed()
}