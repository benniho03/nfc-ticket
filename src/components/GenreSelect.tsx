import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ControllerRenderProps } from "react-hook-form";

export function GenreSelect({ genres, field }: {
  genres: string[], field: ControllerRenderProps<{
    name: string;
    description: string;
    location: string;
    locationAdress: string;
    ticketPrice: number;
    maxTicketAmount: number;
    date: Date;
    genre: string;
  }, "genre">
}) {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <SelectTrigger className="bg-transparent placeholder:text-slate-200 border-2">
        <SelectValue placeholder="Genre" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {
            genres.map((genre) => (
              <SelectItem key={genre} className="capitalize" value={genre}>{genre.toLowerCase()}</SelectItem>
            ))
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
