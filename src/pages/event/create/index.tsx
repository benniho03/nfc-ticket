import { GenreSelect } from "@/components/GenreSelect"
import LoadingSpinner from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/datepicker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/utils/api"
import { UploadButton, UploadDropzone } from "@/utils/uploadthing"
import { Prisma } from "@prisma/client"
import { InferGetServerSidePropsType } from "next"
import Image from "next/image"
import React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { UploadFileResponse } from "uploadthing/client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { SignInButton, useAuth } from "@clerk/nextjs"
import HeaderNavigation from "@/components/header-navigation"



type UploadCompleteInfo = {
    name: string;
    size: number;
}

const CreateEventSchema = z.object({
    name: z.string({ required_error: "Gib deinem Event einen Namen." }).min(3, "Eventname muss mindestens 3 Zeichen lang sein.").max(50, "Eventname darf maximal 50 Zeichen lang sein."),
    description: z.string({ required_error: "Gib deinem Event eine Beschreibung." }).min(10, "Beschreibung muss mindestens 10 Zeichen lang sein.").max(500, "Beschreibung darf maximal 500 Zeichen lang sein."),
    location: z.string({ required_error: "Gib deinem Event einen Standort." }).min(3, "Standort muss mindestens 3 Zeichen lang sein.").max(150, "Standort darf maximal 150 Zeichen lang sein."),
    locationAdress: z.string({ required_error: "Gib deinem Event eine Adresse." }).min(3, "Adresse muss mindestens 3 Zeichen lang sein.").max(150, "Adresse darf maximal 150 Zeichen lang sein."),
    ticketPrice: z.preprocess(input => parseInt(z.string().parse(input)), z.number({ required_error: "Gib deinem Event einen Ticketpreis." }).min(0, "Ticketpreis darf nicht negativ sein.")),
    maxTicketAmount: z.preprocess(input => parseInt(z.string().parse(input)), z.number({ required_error: "Gib deinem Event eine maximale Ticketanzahl." }).min(0, "Ticketanzahl darf nicht negativ sein.")),
    date: z.date({ required_error: "Gib deinem Event ein Datum." }),
    genre: z.string({ required_error: "Gib deinem Event ein Genre." }),
})

export default function EventCreateWizard({ genres }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const { userId } = useAuth()

    const [imageUrl, setImageUrl] = useState<string>("")

    const form = useForm<z.infer<typeof CreateEventSchema>>({
        resolver: zodResolver(CreateEventSchema),
        defaultValues: {}
    })

    const { mutate, isLoading } = api.event.create.useMutation({
        onSuccess() {
            toast.success("Event erstellt.")
            setImageUrl("")
            form.reset()
        }
    })

    if (!userId) return (
        <div>
            Du musst als Admin eingeloggt sein.
            <SignInButton />
        </div>
    )

    function onSubmit(eventDetails: z.infer<typeof CreateEventSchema>) {
        if (!imageUrl) return toast.error("Lade noch ein Bild von deinem Event hoch.")
        mutate({ ...eventDetails, imageUrl })
    }

    function handleUploadComplete(info: UploadFileResponse<UploadCompleteInfo>[]) {
        info.forEach((fileInfo) => {
            setImageUrl(fileInfo.url)
            toast.success(`Uploaded ${fileInfo.name}`)
        })

    }


    return (
        <div className="bg-slate-900 min-h-screen">
            <HeaderNavigation />
            <div className="container py-2">
                <h1 className="text-slate-200 font-bold text-6xl">Neues Event</h1>
            </div>
            <div className="container py-3 bg-slate-700 text-slate-50">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <div className="flex gap-2">
                            <div className="w-full">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Eventname</FormLabel>
                                            <FormControl>
                                                <Input className="bg-transparent placeholder:text-slate-200 border-2" type="text" id="name" placeholder="Wie heißt dein Event?" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-full flex flex-col justify-end">
                                <FormField
                                    control={form.control}
                                    name="genre"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Genre</FormLabel>
                                            <GenreSelect genres={genres} field={field} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Beschreibung</FormLabel>
                                    <FormControl>
                                        <Textarea className="bg-transparent placeholder:text-slate-200  border-2" {...field} id="description" placeholder="Erzähl uns etwas von deinem Event..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2">
                            <div className="flex gap-2 w-full">
                                <div className="w-full">
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Standort</FormLabel>
                                                <FormControl>
                                                    <Input className="bg-transparent placeholder:text-slate-200 border-2" type="text" {...field} id="location" placeholder="Fette Location" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full">
                                    <FormField
                                        control={form.control}
                                        name="locationAdress"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Adresse</FormLabel>
                                                <FormControl>
                                                    <Input className="bg-transparent placeholder:text-slate-200 border-2" type="text" {...field} id="location" placeholder="Partystraße 420, 42069 Fetenhausen" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex w-1/3 items-end">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col w-full">
                                            <FormLabel>Datum</FormLabel>
                                            <DatePicker field={field} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-full">

                                <FormField
                                    control={form.control}
                                    name="ticketPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ticketpreis (€)</FormLabel>
                                            <FormControl>
                                                <Input className="bg-transparent placeholder:text-slate-200 border-2" type="text" {...field} id="price" placeholder="49" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-full">
                                <FormField
                                    control={form.control}
                                    name="maxTicketAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Anzahl Tickets</FormLabel>
                                            <FormControl>
                                                <Input className="bg-transparent placeholder:text-slate-200 border-2" type="text" {...field} id="price" placeholder="800" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                className="ut-button:bg-transparent ut-button:text-slate-50 ut-button:border-2 ut-allowed-content:hidden ut-button:border-slate-50"
                            />
                        </div>

                        <Button className="bg-pink-700" disabled={isLoading} type="submit">{isLoading ? <span className="flex gap-2">Erstelle Event<LoadingSpinner size={18} /></span> : "Event erstellen"}</Button>
                    </form>
                </Form>
            </div>
        </div>
    )

}

export function getServerSideProps() {

    const genres = Prisma.dmmf.datamodel.enums.find((e) => e.name === "Genre")!.values.map((e) => e.name).sort()

    return {
        props: {
            genres
        }
    }
}
