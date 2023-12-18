import { api } from "@/utils/api"
import { useRouter } from "next/router"
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

type TicketShop = {
    tickets: {
        owner: {
            firstName: string;
            lastName: string;
        }
    }[]
}

export default function Shop() {
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
    const router = useRouter()
    const eventId = router.query.eventId as string
    const { mutate } = api.ticket.order.useMutation()

    const { data: event, isLoading, error } = api.event.getOne.useQuery({ eventId })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>An Error Occured</div>
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
                                    {/* {errors.tickets && <span>Vorname fehlt</span>} */}
                                </div>
                                <div>
                                    <label htmlFor={`lastName${index}`}>Nachname</label>
                                    <input type="text" id={`lastName${index}`} {...register(`tickets.${index}.owner.lastName`, {
                                        required: true
                                    })} />
                                    {/* {errors.tickets && <span>{errors.tickets[index]!.message} jojo</span>} */}
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