"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { requireSession } from "@/lib/session"
import { logEvent } from "@/modules/events/log"
import {
  processSchema,
  updateProcessSchema,
  type ProcessInput,
  type UpdateProcessInput,
} from "@/modules/processes/schemas"
import type { ActionResult } from "@/lib/action-result"

async function assertResponsibleBelongsToOrg(organizationId: string, responsibleId?: string) {
  if (!responsibleId) return undefined
  const membership = await db.membership.findFirst({
    where: { organizationId, userId: responsibleId },
    select: { userId: true },
  })
  return membership?.userId
}

export async function createProcessAction(input: ProcessInput): Promise<ActionResult> {
  const session = await requireSession()
  const parsed = processSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  const responsibleId = await assertResponsibleBelongsToOrg(
    session.user.organizationId,
    parsed.data.responsibleId
  )

  const process = await db.process.create({
    data: {
      organizationId: session.user.organizationId,
      number: parsed.data.number,
      client: parsed.data.client,
      court: parsed.data.court,
      county: parsed.data.county,
      type: parsed.data.type,
      notes: parsed.data.notes || null,
      responsibleId,
    },
  })

  await logEvent({
    organizationId: session.user.organizationId,
    actorId: session.user.id,
    type: "PROCESS_CREATED",
    processId: process.id,
    metadata: { number: process.number, client: process.client },
  })

  revalidatePath("/processos")
  revalidatePath("/dashboard")

  return { success: true, data: undefined }
}

export async function updateProcessAction(input: UpdateProcessInput): Promise<ActionResult> {
  const session = await requireSession()
  const parsed = updateProcessSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  const existing = await db.process.findFirst({
    where: { id: parsed.data.id, organizationId: session.user.organizationId, deletedAt: null },
  })
  if (!existing) {
    return { success: false, error: "Processo não encontrado" }
  }

  const responsibleId = await assertResponsibleBelongsToOrg(
    session.user.organizationId,
    parsed.data.responsibleId
  )

  await db.process.update({
    where: { id: existing.id },
    data: {
      number: parsed.data.number,
      client: parsed.data.client,
      court: parsed.data.court,
      county: parsed.data.county,
      type: parsed.data.type,
      notes: parsed.data.notes || null,
      responsibleId: responsibleId ?? null,
    },
  })

  await logEvent({
    organizationId: session.user.organizationId,
    actorId: session.user.id,
    type: "PROCESS_UPDATED",
    processId: existing.id,
    metadata: { number: parsed.data.number },
  })

  revalidatePath("/processos")
  revalidatePath("/dashboard")

  return { success: true, data: undefined }
}

export async function deleteProcessAction(id: string): Promise<ActionResult> {
  const session = await requireSession()

  const existing = await db.process.findFirst({
    where: { id, organizationId: session.user.organizationId, deletedAt: null },
  })
  if (!existing) {
    return { success: false, error: "Processo não encontrado" }
  }

  await db.process.update({ where: { id }, data: { deletedAt: new Date() } })

  await logEvent({
    organizationId: session.user.organizationId,
    actorId: session.user.id,
    type: "PROCESS_DELETED",
    processId: existing.id,
    metadata: { number: existing.number },
  })

  revalidatePath("/processos")
  revalidatePath("/dashboard")

  return { success: true, data: undefined }
}
