import { api } from "@/utils/api"
import { useForm} from "react-hook-form"

type EventUserInput = {
    name: string
    description: string
    date: string
    location: string
    locationAdress: string
    ticketPrice: string
    maxTicketAmount: string
}

export default function Page() {

    const { mutate } = api.event.create.useMutation()

    const { register, handleSubmit, formState: { errors, isLoading } } = useForm<EventUserInput>()

    function onSubmit(eventDetails: EventUserInput) {
        console.log("Details: ", eventDetails)

        mutate(formatEventDetails(eventDetails))
    }

    return (
        <>
            <h1>Create Event</h1>
            {isLoading && <div>loading...</div>}
            <form onSubmit={() => handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="name">Event Name</label>
                    <input type="text" {...register("name", { required: true })} id="name" />
                    {errors.name && <div>{errors.name.message}</div>}
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <input type="text" {...register("description", { required: true })} id="description" />
                    {errors.description && <div>{errors.description.message}</div>}
                </div>
                <div>
                    <label htmlFor="date">Date</label>
                    <input type="datetime-local" {...register("date", { required: true })} id="date" />
                    {errors.date && <div>{errors.date.message}</div>}
                </div>
                <div>
                    <label htmlFor="location">Location</label>
                    <input type="text" {...register("location", { required: true })} id="location" />
                    {errors.location && <div>{errors.location.message}</div>}
                </div>
                <div>
                    <label htmlFor="locationAdress">Location Adress</label>
                    <input type="text" {...register("locationAdress", { required: true })} id="location" />
                    {errors.locationAdress && <div>{errors.locationAdress.message}</div>}
                </div>
                <div>
                    <label htmlFor="ticketPrice">Ticket Price</label>
                    <input type="text" {...register("ticketPrice", { required: true })} id="price" />
                    {errors.ticketPrice && <div>{errors.ticketPrice.message}</div>}
                </div>
                <div>
                    <label htmlFor="ticketAmount">Ticket Amount</label>
                    <input type="text" {...register("maxTicketAmount", { required: true })} id="price" />
                    {errors.maxTicketAmount && <div>{errors.maxTicketAmount.message}</div>}
                </div>
                <button type="submit">Create Event</button>
            </form>
        </>
    )
}

function formatEventDetails(eventDetails: EventUserInput) {
    const date = new Date(eventDetails.date)
    const ticketPrice = Number(eventDetails.ticketPrice)
    const maxTicketAmount = Number(eventDetails.maxTicketAmount)

    return { ...eventDetails, date, ticketPrice, maxTicketAmount }
}