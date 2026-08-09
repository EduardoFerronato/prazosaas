import type { Metadata } from "next"
import { listProcesses } from "@/modules/processes/queries"
import { listOrganizationMembers } from "@/modules/organizations/queries"
import { ProcessesTable } from "@/modules/processes/components/processes-table"

export const metadata: Metadata = { title: "Processos" }

export default async function ProcessesPage() {
  const [processes, members] = await Promise.all([listProcesses(), listOrganizationMembers()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Processos</h1>
        <p className="text-muted-foreground text-sm">
          {processes.length} processo{processes.length === 1 ? "" : "s"} cadastrado
          {processes.length === 1 ? "" : "s"}.
        </p>
      </div>

      <ProcessesTable processes={processes} members={members} />
    </div>
  )
}
