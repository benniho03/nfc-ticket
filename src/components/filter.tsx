import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SortOptions } from "@/pages/event"


export function SelectFilter({ setSortBy }: { setSortBy: React.Dispatch<React.SetStateAction<SortOptions>> }) {
  const options: { label: string, value: SortOptions }[] = [
    { label: "Datum", value: "DATE" },
    { label: "Preis aufsteigend", value: "PRICE ASC" },
    { label: "Preis absteigend", value: "PRICE DESC" }
  ]

  return (
    <Select onValueChange={(value) => setSortBy(value as SortOptions)}>
      <SelectTrigger className="bg-transparent placeholder:text-slate-900 border-2">
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Filter</SelectLabel>
          {
              options.map((option) => <SelectItem value={option.value}>{option.label}</SelectItem>)
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}  
