import "server-only"

import type { EventType, Prisma } from "@/generated/prisma/client"
import { db } from "@/lib/db"

interface LogEventInput {
  organizationId: string
  actorId: string | null
  type: EventType
  processId?: string
  deadlineId?: string
  metadata?: Prisma.InputJsonValue
  tx?: Prisma.TransactionClient
}

export async function logEvent({
  organizationId,
  actorId,
  type,
  processId,
  deadlineId,
  metadata,
  tx,
}: LogEventInput) {
  const client = tx ?? db
  await client.event.create({
    data: { organizationId, actorId, type, processId, deadlineId, metadata },
  })
}
