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


  export function SelectFilter() {
    return (
      <Select>
        <SelectTrigger className="bg-transparent placeholder:text-slate-900 border-2">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Filter</SelectLabel>
            <SelectItem value="low-price">Preis aufsteigend</SelectItem>
            <SelectItem value="high-price">Preis absteigend</SelectItem>
            <SelectItem value="date">Datum</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }  
