import "server-only"

import { db } from "@/lib/db"
import { requireSession } from "@/lib/session"

export async function listPendingDjenImports() {
  const session = await requireSession()

  return db.djenImport.findMany({
    where: { organizationId: session.user.organizationId, status: "PENDING" },
    include: { user: { select: { name: true } } },
    orderBy: { dataDisponibilizacao: "desc" },
  })
}

export type DjenImportListItem = Awaited<ReturnType<typeof listPendingDjenImports>>[number]

export async function countPendingDjenImports() {
  const session = await requireSession()
  return db.djenImport.count({
    where: { organizationId: session.user.organizationId, status: "PENDING" },
  })
}
