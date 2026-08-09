import type { Metadata } from "next"
import { listDeadlines } from "@/modules/deadlines/queries"
import { listProcessOptions } from "@/modules/processes/queries"
import { listOrganizationMembers } from "@/modules/organizations/queries"
import { DeadlinesTable } from "@/modules/deadlines/components/deadlines-table"

export const metadata: Metadata = { title: "Prazos" }

export default async function DeadlinesPage() {
  const [deadlines, processes, members] = await Promise.all([
    listDeadlines(),
    listProcessOptions(),
    listOrganizationMembers(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Prazos</h1>
        <p className="text-muted-foreground text-sm">
          {deadlines.length} prazo{deadlines.length === 1 ? "" : "s"} cadastrado
          {deadlines.length === 1 ? "" : "s"}.
          {processes.length === 0 ? " Cadastre um processo antes de criar prazos." : ""}
        </p>
      </div>

      <DeadlinesTable deadlines={deadlines} processes={processes} members={members} />
    </div>
  )
}
