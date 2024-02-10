import { appRouter } from "@/server/api/root";
import { db } from "@/server/db";
import { api } from "@/utils/api"
import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import superjson from "superjson";
import { useFieldArray, useForm } from "react-hook-form";
import { redirect } from "next/navigation";
import { getAuth } from "@clerk/nextjs/server";
import { Form, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useState } from "react";
import HeaderNavigation from "@/components/header-navigation";
import { getRemainingTicketPercentage } from "..";
import { MinusCircleIcon, MinusIcon, PlusIcon, TicketIcon } from "@heroicons/react/24/outline";
import { SignInButton, useUser } from "@clerk/nextjs";

type TicketShop = {
    tickets: {
        owner: {
            firstName: string;
            lastName: string;
        }
    }[]
}

export default function Shop({ eventId }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const { isSignedIn } = useUser()

    const { control, register, handleSubmit, formState: { errors, isSubmitSuccessful }, reset } = useForm<TicketShop>({
        defaultValues: {
            tickets: [{
                owner: {
                    firstName: "",
                    lastName: ""
                }
            }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "tickets", // unique name for your Field Array
    });

    const { mutate } = api.ticket.order.useMutation({
        onSuccess() {
            toast.success("Tickets erfolgreich bestellt.")
            reset()
        },
        onError() {
            toast.error("Keine Tickets für dieses Event verfügbar.")
        }
    })

    const { data: event } = api.event.getOne.useQuery({ eventId })

    if (!event) return <div>404</div>

    const [ticketsSold, setTicketsSold] = useState(event.ticketsSold)

    if (!isSignedIn) return (
        <div className="text-slate-50 w-full mt-3 justify-center items-center p-4"><p>Bitte melde dich an, um Tickets zu bestellen!</p>
            <Button className="bg-pink-700">
                <SignInButton />
            </Button>
        </div>
    )

    function formatTicketData(ticketDetails: TicketShop) {
        return ticketDetails.tickets
            .map(ticket => {
                return {
                    eventId: eventId,
                    firstName: ticket.owner.firstName,
                    lastName: ticket.owner.lastName
                }
            });
    }

    function buyTickets(ticketDetails: TicketShop) {
        mutate(formatTicketData(ticketDetails))
        if (ticketsSold === event?.maxTicketAmount) return
        setTicketsSold(ticketsSold + ticketDetails.tickets.length)
    }

    return (
        <>
            <div className="bg-slate-900 min-h-screen">
                <HeaderNavigation />
                <div className="container py-2">
                    <h1 className="text-slate-200 font-bold text-6xl">{event.name}</h1>
                </div>
                <div className="container py-3 bg-slate-700 text-slate-50 rounded-lg">
                    <p className="text-xl">
                        Nur noch <span className="font-bold">
                            {getRemainingTicketPercentage(event.maxTicketAmount, ticketsSold)}%
                        </span> der Tickets verfügbar!
                    </p>
                    {errors.tickets && <span>Bitte fülle alle Felder aus!</span>}
                    <form onSubmit={handleSubmit(buyTickets)}>
                        {
                            fields.map((field, index) => {
                                return (
                                    <div key={field.id} className="flex items-center gap-4 py-3 w-1/2">
                                        <span className="text-lg font-extrabold">{index + 1}.</span>
                                        <div className="mb-2 w-1/2">
                                            <label className="font-medium" htmlFor={`firstName${index}`} placeholder={`Vorname der Person ${index}`}>Vorname</label>
                                            <input className="bg-transparent flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" type="text" id={`firstName${index}`} {...register(`tickets.${index}.owner.firstName`, {
                                                required: true
                                            })} />
                                        </div>
                                        <div className="mb-2 w-1/2">
                                            <label className="font-medium" htmlFor={`lastName${index}`}>Nachname</label>
                                            <input className="bg-transparent flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" type="text" id={`lastName${index}`} {...register(`tickets.${index}.owner.lastName`, {
                                                required: true
                                            })} />
                                        </div>
                                        <Button
                                            disabled={index === 0}
                                            size={"sm"} className="bg-slate-900 rounded" type="button"
                                            onClick={() => remove(index)}>
                                            <MinusCircleIcon className="h-5 w-5 inline-block text-slate-50" />
                                        </Button>

                                    </div>
                                )
                            })
                        }
                        <div className="w-1/2 flex items-center justify-start mb-3">

                            <Button size={"sm"} className="bg-slate-900 flex items-center gap-2" type="button" onClick={() => append({
                                owner: {
                                    firstName: "",
                                    lastName: ""
                                }
                            })}>
                                <PlusIcon className="h-5 w-5 inline-block text-slate-50" />
                                Weiteres Ticket hinzufügen
                            </Button>
                        </div>
                        <div className="mb-3">
                            <p className="text-slate-200">Gesamtpreis: <span className="font-bold">{event.ticketPrice * fields.length}€</span></p>
                        </div>
                        <Button className="bg-pink-700 flex items-center gap-2" type="submit">
                            <TicketIcon className="h-5 w-5 inline-block text-slate-50" />
                            Tickets bestellen
                        </Button>
                    </form>
                </div >

            </div >
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext<{ eventId: string }>) {

    const ssr = createServerSideHelpers({
        router: appRouter,
        ctx: {
            db,
            userId: null
        },
        transformer: superjson,
    });

    const eventId = context.params?.eventId as string;

    if (!eventId) throw new Error("No eventId provided")

    await ssr.event.getOne.prefetch({ eventId });

    return {
        props: {
            trpcState: ssr.dehydrate(),
            eventId
        }
    }
}