import { appRouter } from "@/server/api/root";
import { db } from "@/server/db";
import { api } from "@/utils/api"
import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import superjson from "superjson";
import { useFieldArray, useForm } from "react-hook-form";
import { redirect } from "next/navigation";

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

    const { data: event } = api.event.getOne.useQuery({ eventId })

    if(!event) return <div>404</div>

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
            <h1>Ticket-Shop yeah für {event.name}</h1>
            {errors.tickets && <span>Bitte fülle alle Felder aus!</span>}
            <form onSubmit={handleSubmit(buyTickets)}>
                {
                    fields.map((field, index) => {
                        return (
                            <div key={field.id}>
                                <div>
                                    <label htmlFor={`firstName${index}`}>Vorname</label>
                                    <input type="text" id={`firstName${index}`} {...register(`tickets.${index}.owner.firstName`, {
                                        required: true
                                    })} />
                                </div>
                                <div>
                                    <label htmlFor={`lastName${index}`}>Nachname</label>
                                    <input type="text" id={`lastName${index}`} {...register(`tickets.${index}.owner.lastName`, {
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
                })}>Ticket hinzufügen</button>
                <button type="submit">Tickets bestellen</button>
            </form>
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

    if(!eventId) throw new Error("No eventId provided")

    await ssr.event.getOne.prefetch({ eventId });

    return {
        props: {
            trpcState: ssr.dehydrate(),
            eventId
        }
    }
}