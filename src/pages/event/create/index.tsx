import LoadingSpinner from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/datepicker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RouterOutputs, api } from "@/utils/api"
import { UploadButton, UploadDropzone } from "@/utils/uploadthing"
import Image from "next/image"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { UploadFileResponse } from "uploadthing/client"

type EventUserInput = {
    name: string
    description: string
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

    const [imageUrl, setImageUrl] = useState<string>("")
    const [date, setDate] = useState<Date>(new Date())

    const { mutate, isLoading } = api.event.create.useMutation({
        onSuccess() {
            toast.success("Event erstellt.")
            setImageUrl("")
            setDate(new Date())
            reset()
        }
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm<EventUserInput>()

    function onSubmit(eventDetails: EventUserInput) {

        if (!imageUrl) return toast.error("Lade noch ein Bild von deinem Event hoch.")
        if (!date) return toast.error("Wann steigt die Fete?")

        mutate(formatEventDetails({ ...eventDetails }, imageUrl, date))
    }

    function handleUploadComplete(info: UploadFileResponse<UploadCompleteInfo>[]) {
        info.forEach((fileInfo) => {
            setImageUrl(fileInfo.url)
            toast.success(`Uploaded ${fileInfo.name}`)
        })

    }


    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="font-bold text-2xl mb-2">Neues Event</h1>
            <form className="px-4 py-3 border rounded flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Eventname</Label>
                    <Input type="text" id="name" placeholder="Wie heißt dein Event?" {...register("name", { required: true })} />
                    {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="description">Beschreibung</Label>
                    <Textarea {...register("description", { required: true })} id="description" placeholder="Erzähl uns etwas von deinem Event..." />
                    {errors.description && <span className="text-sm text-red-500">{errors.description.message}</span>}
                </div>
                <div className="flex w-full gap-2">
                    <div className="flex flex-col gap-2 w-full">
                        <Label htmlFor="location">Standort</Label>
                        <Input type="text"
                            {...register("location", { required: true })}
                            id="location" placeholder="Fette Location" />
                        {errors.location && <span className="text-sm text-red-500">{errors.location.message}</span>}
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <Label htmlFor="locationAdress">Adresse</Label>
                        <Input type="text"
                            {...register("locationAdress", { required: true })}
                            id="location" placeholder="Partystraße 420, 42069 Fetenhausen" />
                        {errors.locationAdress && <span className="text-sm text-red-500">{errors.locationAdress.message}</span>}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="date">Datum</Label>
                    <DatePicker date={date} setDate={setDate} />
                </div>
                <div className="flex w-full gap-2">
                    <div className="flex flex-col gap-2 w-full">
                        <Label htmlFor="ticketPrice">Ticketpreis (€)</Label>
                        <Input type="text" {...register("ticketPrice", {
                            required: true, pattern: { value: /^\d+$/, message: "Ticketpreis muss eine Zahl sein." }
                        })} id="price" placeholder="49" />
                        {errors.ticketPrice && <span className="text-sm text-red-500">{errors.ticketPrice.message}</span>}
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <Label htmlFor="ticketAmount">Anzahl Tickets</Label>
                        <Input type="text" {...register("maxTicketAmount", {
                            required: true, pattern: { value: /^\d+$/, message: "Ticketanzahl muss eine Zahl sein." }
                        })} id="price" placeholder="800" />
                        {errors.maxTicketAmount && <span className="text-sm text-red-500">{errors.maxTicketAmount.message}</span>}
                    </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                    <Label>Teaserbild</Label>
                    {
                        imageUrl ?
                            <Image src={imageUrl} className="border rounded aspect-square object-cover" width={164} height={164} alt={"Placeholder"} /> :
                            <Image src="/placeholder.jpg" className="border rounded aspect-square object-cover" width={164} height={164} alt={"Placeholder"} />
                    }
                    <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(fileInfo) => handleUploadComplete(fileInfo)}
                        onUploadError={(err) => toast.error(err.message)}
                        className="ut-button:bg-secondary ut-button:text-secondary-foreground"
                    />
                </div>
                <Button className="w-1/3 md:w-1/4 lg:w-1/5" disabled={isLoading} type="submit">
                    {isLoading ? <span className="flex gap-3 items-center">Erstelle Event<LoadingSpinner size={18} /></span> : "Event erstellen"}
                </Button>
            </form>
        </div>
    )
}

function formatEventDetails(eventDetails: EventUserInput, imageUrl: string, date: Date) {
    const ticketPrice = Number(eventDetails.ticketPrice)
    const maxTicketAmount = Number(eventDetails.maxTicketAmount)

    return { ...eventDetails, date, ticketPrice, maxTicketAmount, imageUrl }
}