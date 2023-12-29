"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { FormControl } from "./form"
import { ControllerRenderProps } from "react-hook-form"


// Pass state from parent component
export function DatePicker({ field }: {
    field: ControllerRenderProps<{
        name: string;
        description: string;
        location: string;
        locationAdress: string;
        ticketPrice: number;
        maxTicketAmount: number;
        date: Date;
        genre: string;
    }, "date">
}) {
    return (
        <Popover>
            <PopoverTrigger asChild className="bg-transparent placeholder:text-slate-200">
                <FormControl>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal border-2",
                            !field.value && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-200" />
                        {field.value ? format(field.value, "PPP") : <span className="text-slate-200">Datum</span>}
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
