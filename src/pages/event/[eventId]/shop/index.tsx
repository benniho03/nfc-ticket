import { api } from "@/utils/api"
import { useRouter } from "next/router"
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

type TicketName = {
    owner: {
        firstName: string;
        lastName: string;
    }
}

export default function Shop() {
    const { control, register } = useForm<TicketName[]>({
        defaultValues: [{
            owner: {
                firstName: "",
                lastName: ""
            }
        }]
    });
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "owner", // unique name for your Field Array
    });
    const [ticketAmount, setTicketAmount] = useState<number>(1);
    const router = useRouter()
    const eventId = router.query.eventId as string

    const { data: event, isLoading, error } = api.event.getOne.useQuery({ eventId })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>An Error Occured</div>
    if (!event) return <div>404</div>

    return (
        <>
            <h1>Ticket-Shop yeah für {event.name}</h1>
            <form>
                {
                    fields.map((field, index) => {
                        return (
                            <div key={field.id}>
                                <div>
                                    <label htmlFor={`firstName${index}`}>Vorname</label>
                                    <input type="text" id={`firstName${index}`} {...register(`ticketNames.${index}.value`)} />
                                </div>
                                <div>
                                    <label htmlFor={`lastName${index}`}>Nachname</label>
                                    <input type="text" id={`lastName${index}`} />
                                </div>
                            </div>
                        )
                    })
                }

                <button type="button" onClick={() => { setTicketAmount(ticketAmount + 1) }}>Ticket hinzufügen</button>
                <button type="submit">Tickets bestellen</button>
            </form>
        </>
    )
}