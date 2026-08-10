import "server-only"

import { db } from "@/lib/db"
import { requireSession } from "@/lib/session"

export async function getCurrentUser() {
  const session = await requireSession()
  const user = await db.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, createdAt: true, oabNumber: true, oabUf: true },
  })
  return { ...user, organizationId: session.user.organizationId, role: session.user.role }
}
