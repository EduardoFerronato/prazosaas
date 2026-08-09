import type { Metadata } from "next"
import { DataTable } from "@/components/shared/data-table"
import { listProcesses } from "@/modules/processes/queries"
import { processColumns } from "@/modules/processes/columns"

export const metadata: Metadata = { title: "Processos" }

export default async function ProcessesPage() {
  const processes = await listProcesses()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Processos</h1>
        <p className="text-muted-foreground text-sm">
          {processes.length} processo{processes.length === 1 ? "" : "s"} cadastrado
          {processes.length === 1 ? "" : "s"}.
        </p>
      </div>

      <DataTable
        columns={processColumns}
        data={processes}
        emptyMessage="Nenhum processo cadastrado ainda."
      />
    </div>
  )
}
