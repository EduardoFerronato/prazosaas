"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/shared/data-table"
import { getProcessColumns } from "@/modules/processes/columns"
import { NewProcessButton } from "@/modules/processes/components/new-process-button"
import type { ProcessListItem } from "@/modules/processes/queries"

export function ProcessesTable({
  processes,
  members,
}: {
  processes: ProcessListItem[]
  members: { id: string; name: string }[]
}) {
  const [search, setSearch] = useState("")
  const columns = useMemo(() => getProcessColumns(members), [members])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por número, cliente ou tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <NewProcessButton members={members} />
      </div>

      <DataTable
        columns={columns}
        data={processes}
        globalFilter={search}
        emptyMessage="Nenhum processo encontrado."
      />
    </div>
  )
}
