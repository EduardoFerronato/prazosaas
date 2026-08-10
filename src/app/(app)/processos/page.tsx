import type { Metadata } from "next"
import { listProcesses } from "@/modules/processes/queries"
import { listOrganizationMembers } from "@/modules/organizations/queries"
import { ProcessesTable } from "@/modules/processes/components/processes-table"
import { listPendingDjenImports } from "@/modules/djen/queries"
import { DjenPendingPanel } from "@/modules/djen/components/djen-pending-panel"
import { getCurrentUser } from "@/modules/auth/queries"

export const metadata: Metadata = { title: "Processos" }

export default async function ProcessesPage() {
  const [processes, members, pendingDjenImports, user] = await Promise.all([
    listProcesses(),
    listOrganizationMembers(),
    listPendingDjenImports(),
    getCurrentUser(),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Processos</h1>
        <p className="text-muted-foreground text-sm">
          {processes.length} processo{processes.length === 1 ? "" : "s"} cadastrado
          {processes.length === 1 ? "" : "s"}.
        </p>
      </div>

      <DjenPendingPanel
        items={pendingDjenImports}
        members={members}
        hasOab={!!(user.oabNumber && user.oabUf)}
      />

      <ProcessesTable processes={processes} members={members} />
    </div>
  )
}
