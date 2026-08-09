"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/shared/data-table"
import { getDeadlineColumns } from "@/modules/deadlines/columns"
import { NewDeadlineButton } from "@/modules/deadlines/components/new-deadline-button"
import type { DeadlineListItem } from "@/modules/deadlines/queries"
import type { ProcessOption } from "@/modules/processes/queries"

export function DeadlinesTable({
  deadlines,
  processes,
  members,
}: {
  deadlines: DeadlineListItem[]
  processes: ProcessOption[]
  members: { id: string; name: string }[]
}) {
  const [search, setSearch] = useState("")
  const columns = useMemo(() => getDeadlineColumns(processes, members), [processes, members])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por tipo de prazo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <NewDeadlineButton processes={processes} members={members} />
      </div>

      <DataTable
        columns={columns}
        data={deadlines}
        globalFilter={search}
        emptyMessage="Nenhum prazo encontrado."
      />
    </div>
  )
}
