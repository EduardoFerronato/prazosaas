import "server-only"

import { db } from "@/lib/db"
import { requireSession } from "@/lib/session"

export async function listOrganizationMembers() {
  const session = await requireSession()

  const memberships = await db.membership.findMany({
    where: { organizationId: session.user.organizationId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { user: { name: "asc" } },
  })

  return memberships.map((m) => m.user)
}
