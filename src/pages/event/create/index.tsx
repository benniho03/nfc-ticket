import { RouterOutputs, api } from "@/utils/api"
import { UploadButton, UploadDropzone } from "@/utils/uploadthing"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { UploadFileResponse } from "uploadthing/client"

type EventUserInput = {
    name: string
    description: string
    date: Date
    location: string
    locationAdress: string
    ticketPrice: number
    maxTicketAmount: number,
}

type UploadCompleteInfo = {
    name: string;
    size: number;
}

export default function Page() {

    const imageUrl = useRef<string>()

    const { mutate } = api.event.create.useMutation()

    const { register, handleSubmit, formState: { errors, isLoading } } = useForm<EventUserInput>()

    function onSubmit(eventDetails: EventUserInput) {

        console.log("Hello?")

        if (!imageUrl.current) return toast.error("No image uploaded")

        mutate(formatEventDetails({ ...eventDetails }, imageUrl.current))
    }

    function handleUploadComplete(info: UploadFileResponse<UploadCompleteInfo>[]) {
        info.forEach((fileInfo) => {
            imageUrl.current = fileInfo.url
            toast.success(`Uploaded ${fileInfo.name}`)
        })

    }

    return (
        <>
            <h1>Create Event</h1>
            {isLoading && <div>loading...</div>}
            <form className="p-2" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="name">Event Name</label>
                    <input type="text" {...register("name", { required: true })} id="name" />
                    {errors.name && <div>{errors.name.message}</div>}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="description">Description</label>
                    <input type="text" {...register("description", { required: true })} id="description" />
                    {errors.description && <div>{errors.description.message}</div>}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="date">Date</label>
                    <input type="datetime-local" {...register("date", { required: true, valueAsDate: true })} id="date" />
                    {errors.date && <div>{errors.date.message}</div>}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="location">Location</label>
                    <input type="text" {...register("location", { required: true })} id="location" />
                    {errors.location && <div>{errors.location.message}</div>}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="locationAdress">Location Adress</label>
                    <input type="text" {...register("locationAdress", { required: true })} id="location" />
                    {errors.locationAdress && <div>{errors.locationAdress.message}</div>}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="ticketPrice">Ticket Price</label>
                    <input type="text" {...register("ticketPrice", {
                        required: true, pattern: { value: /^\d+$/, message: "Ticket Price must be a number" }
                    })} id="price" />
                    {errors.ticketPrice && <div>{errors.ticketPrice.message}</div>}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="ticketAmount">Ticket Amount</label>
                    <input type="text" {...register("maxTicketAmount", {
                        required: true, pattern: { value: /^\d+$/, message: "Ticket Amount must be a number" }
                    })} id="price" />
                    {errors.maxTicketAmount && <div>{errors.maxTicketAmount.message}</div>}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="image">Image</label>
                    <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(fileInfo) => handleUploadComplete(fileInfo)}
                        onUploadError={(err) => toast.error(err.message)}
                    />
                </div>
                <button type="submit">Create Event</button>
            </form>
        </>
    )
}

function formatEventDetails(eventDetails: EventUserInput, imageUrl: string) {
    const date = new Date(eventDetails.date)
    const ticketPrice = Number(eventDetails.ticketPrice)
    const maxTicketAmount = Number(eventDetails.maxTicketAmount)

    return { ...eventDetails, date, ticketPrice, maxTicketAmount, imageUrl }
}