import "server-only"

import { db } from "@/lib/db"
import { requireSession } from "@/lib/session"

export async function listDeadlines() {
  const session = await requireSession()

  return db.deadline.findMany({
    where: { organizationId: session.user.organizationId, deletedAt: null },
    include: {
      process: { select: { number: true, client: true } },
      responsible: { select: { name: true } },
    },
    orderBy: { dueDate: "asc" },
  })
}

export async function listUpcomingDeadlines(limit = 5) {
  const session = await requireSession()

  return db.deadline.findMany({
    where: {
      organizationId: session.user.organizationId,
      deletedAt: null,
      status: "PENDING",
    },
    include: {
      process: { select: { number: true, client: true } },
    },
    orderBy: { dueDate: "asc" },
    take: limit,
  })
}

export async function getDeadlineCounts() {
  const session = await requireSession()
  const where = { organizationId: session.user.organizationId, deletedAt: null } as const

  const [pending, missed, completed] = await Promise.all([
    db.deadline.count({ where: { ...where, status: "PENDING" } }),
    db.deadline.count({ where: { ...where, status: "MISSED" } }),
    db.deadline.count({ where: { ...where, status: "COMPLETED" } }),
  ])

  return { pending, missed, completed }
}

export type DeadlineListItem = Awaited<ReturnType<typeof listDeadlines>>[number]
