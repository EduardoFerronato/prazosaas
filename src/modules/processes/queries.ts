import "server-only"

import { db } from "@/lib/db"
import { requireSession } from "@/lib/session"

export async function listProcesses() {
  const session = await requireSession()

  return db.process.findMany({
    where: { organizationId: session.user.organizationId, deletedAt: null },
    include: {
      responsible: { select: { name: true } },
      _count: { select: { deadlines: { where: { deletedAt: null } } } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export type ProcessListItem = Awaited<ReturnType<typeof listProcesses>>[number]

export async function listProcessOptions() {
  const session = await requireSession()

  return db.process.findMany({
    where: { organizationId: session.user.organizationId, deletedAt: null },
    select: { id: true, number: true, client: true, county: true },
    orderBy: { createdAt: "desc" },
  })
}

export type ProcessOption = Awaited<ReturnType<typeof listProcessOptions>>[number]
