import type { Metadata } from "next"
import { DataTable } from "@/components/shared/data-table"
import { listDeadlines } from "@/modules/deadlines/queries"
import { deadlineColumns } from "@/modules/deadlines/columns"

export const metadata: Metadata = { title: "Prazos" }

export default async function DeadlinesPage() {
  const deadlines = await listDeadlines()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Prazos</h1>
        <p className="text-muted-foreground text-sm">
          {deadlines.length} prazo{deadlines.length === 1 ? "" : "s"} cadastrado
          {deadlines.length === 1 ? "" : "s"}.
        </p>
      </div>

      <DataTable
        columns={deadlineColumns}
        data={deadlines}
        emptyMessage="Nenhum prazo cadastrado ainda."
      />
    </div>
  )
}
