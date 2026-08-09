"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { ProcessListItem } from "@/modules/processes/queries"

export const processColumns: ColumnDef<ProcessListItem>[] = [
  {
    accessorKey: "number",
    header: "Número",
    cell: ({ row }) => <span className="font-mono text-sm">{row.original.number}</span>,
  },
  {
    accessorKey: "client",
    header: "Cliente",
  },
  {
    id: "location",
    header: "Tribunal / Comarca",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.court} · {row.original.county}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipo",
  },
  {
    id: "responsible",
    header: "Responsável",
    cell: ({ row }) => row.original.responsible?.name ?? "—",
  },
  {
    id: "deadlines",
    header: "Prazos",
    cell: ({ row }) => row.original._count.deadlines,
  },
]
