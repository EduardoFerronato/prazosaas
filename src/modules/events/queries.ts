import "server-only"

import { db } from "@/lib/db"
import { requireSession } from "@/lib/session"

export async function listRecentEvents(limit = 8) {
  const session = await requireSession()

  return db.event.findMany({
    where: { organizationId: session.user.organizationId },
    include: {
      actor: { select: { name: true } },
      process: { select: { number: true, client: true } },
      deadline: { select: { type: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

export type RecentEvent = Awaited<ReturnType<typeof listRecentEvents>>[number]
