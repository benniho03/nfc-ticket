import { appRouter } from "@/server/api/root";
import { db } from "@/server/db";
import { api } from "@/utils/api"
import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import superjson from "superjson";
import { useFieldArray, useForm } from "react-hook-form";
import { redirect } from "next/navigation";
import { Form, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

type TicketShop = {
    tickets: {
        owner: {
            firstName: string;
            lastName: string;
        }
    }[]
}

export default function Shop({ eventId }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const { control, register, handleSubmit, formState: { errors } } = useForm<TicketShop>({
        defaultValues: {
            tickets: [{
                owner: {
                    firstName: "",
                    lastName: ""
                }
            }]
        }
    });
    const { fields, append } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "tickets", // unique name for your Field Array
    });
    const { mutate } = api.ticket.order.useMutation()

    const ticketAmount = 1;

    const { data: event } = api.event.getOne.useQuery({ eventId })

    if (!event) return <div>404</div>

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
        console.log(formatTicketData(ticketDetails))
    }

    return (
        <>
            <div className="bg-slate-900 min-h-screen">
                <div className="container py-2">
                    <h1 className="text-slate-200 font-bold text-6xl">Ticket-Shop yeah für {event.name}</h1>
                </div>
                <div className="container py-3 bg-slate-700 text-slate-50">
                    <p>
                        Noch verfügbare Tickets: {event.maxTicketAmount - event.ticketsSold}
                        /{event.maxTicketAmount}
                    </p>
                    {errors.tickets && <span>Bitte fülle alle Felder aus!</span>}
                    <form onSubmit={handleSubmit(buyTickets)}>
                        {
                            fields.map((field, index) => {
                                return (
                                    <div key={field.id}>
                                        <p className="text-lg">{index + 1}. Person</p>
                                        <div className="mb-2">
                                            <label className="font-medium" htmlFor={`firstName${index}`} placeholder={`Vorname der Person ${index}`}>Vorname</label>
                                            <input className="bg-transparent flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" type="text" id={`firstName${index}`} {...register(`tickets.${index}.owner.firstName`, {
                                                required: true
                                            })} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="font-medium" htmlFor={`lastName${index}`}>Nachname</label>
                                            <input className="bg-transparent flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" type="text" id={`lastName${index}`} {...register(`tickets.${index}.owner.lastName`, {
                                                required: true
                                            })} />
                                        </div>
                                    </div>
                                )
                            })
                        }

                        <button type="button" onClick={() => append({
                            owner: {
                                firstName: "",
                                lastName: ""
                            }
                        })}></button>
                        <Button className="bg-pink-700 mr-3" type="button" onClick={() => append({
                            owner: {
                                firstName: "",
                                lastName: ""
                            }
                        })}>Ticket hinzufügen</Button>
                        <Button className="bg-pink-700" type="submit">Tickets bestellen</Button>
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
            db
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