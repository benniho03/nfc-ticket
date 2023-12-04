import { EventDetails } from "@/server/api/routers/events";
import { api } from "@/utils/api";
import { auth, useUser } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function Page({ userId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    const eventId = router.query.eventId as string

    const { data: event, isLoading, error } = api.event.getOne.useQuery({ eventId })

    if(!userId) return <div>Not signed in</div>

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

function TicketShop({ id: eventId, maxTicketAmount, ticketsSold, ticketPrice, userId }: EventDetails & InferGetServerSidePropsType<typeof getServerSideProps>) {

    const { mutate, isLoading, error } = api.ticket.create.useMutation()
    const { handleSubmit, formState: { errors }, register } = useForm<TicketUserInput>()

    if (error) toast.error(error.message, {
        icon: "❌"
    })
    if (isLoading) toast.loading("Loading...")

    type TicketUserInput = {
        amount: number,
        eventId: string
    }


    function onSubmit({ amount }: TicketUserInput) {

        if (!userId) return toast.error("You need to be logged in to buy a ticket")

        amount = Number(amount)

        mutate({ amount, eventId, userId })
        if (error) return
        toast.success(`Bought ${amount} Tickets`)

    }

    return (
        <div>
            <p>Nuzter: {userId}</p>
            <h2>Want to buy a ticket?</h2>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="amount">Amount</label>
                    <input type="text" id="amount" {...register("amount")} />
                    {errors.amount && <div>{errors.amount.message}</div>}
                    <button type="submit">Buy</button>
                </form>
            </div>

            <p>Noch {getRemainingTicketPercentage(maxTicketAmount, ticketsSold)} % der Tickets verbleibend!</p>
            <p>{ticketsSold}</p>
            <p>{ticketPrice}</p>
        </div>
    )
}

function getRemainingTicketPercentage(maxTicketAmount: number, ticketsSold: number) {
    if (ticketsSold === 0) return 100
    return (1 - (maxTicketAmount / ticketsSold) * 100).toFixed()
}

function getServerSideProps() {

    const { user, isSignedIn } = useUser()

    if (!isSignedIn) return {
        redirect: {
            destination: "/",
            permanent: false
        }
    }

    return {
        props: {
            userId: user?.id
        }
    }

}