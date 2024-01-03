type User = {
    id: string
    status: string
    firstname: string
    lastname: string,
  }

import { ColumnDef, getCoreRowModel, useReactTable, flexRender } from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"


export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "Ticket Id",
  },
  {
    accessorKey: "status",
    header: "Ticket Status",
  },
  {
    accessorKey: "firstname",
    header: "Vorname",
  },
  {
    accessorKey: "lastname",
    header: "Nachname",
  }
]

interface DataTableProps<TData, TValue>{
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function UsersTable({users}: {users: User[]}){
    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
      })
      
    return(
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )
}