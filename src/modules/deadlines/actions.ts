"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { requireSession } from "@/lib/session"
import { logEvent } from "@/modules/events/log"
import { calculateDeadline } from "@/modules/deadlines/calculation/engine"
import { parseLocalDate } from "@/modules/deadlines/calculation/parse-local-date"
import {
  deadlineSchema,
  updateDeadlineSchema,
  type DeadlineInput,
  type UpdateDeadlineInput,
} from "@/modules/deadlines/schemas"
import type { ActionResult } from "@/lib/action-result"

async function assertResponsibleBelongsToOrg(organizationId: string, responsibleId?: string) {
  if (!responsibleId) return undefined
  const membership = await db.membership.findFirst({
    where: { organizationId, userId: responsibleId },
    select: { userId: true },
  })
  return membership?.userId
}

export async function createDeadlineAction(input: DeadlineInput): Promise<ActionResult> {
  const session = await requireSession()
  const parsed = deadlineSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  const process = await db.process.findFirst({
    where: {
      id: parsed.data.processId,
      organizationId: session.user.organizationId,
      deletedAt: null,
    },
  })
  if (!process) {
    return { success: false, error: "Processo não encontrado" }
  }

  const responsibleId = await assertResponsibleBelongsToOrg(
    session.user.organizationId,
    parsed.data.responsibleId
  )

  const intimationDate = parseLocalDate(parsed.data.intimationDate)
  const { dueDate, calculationConfidence } = calculateDeadline({
    intimationDate,
    days: parsed.data.days,
    county: process.county,
  })

  const deadline = await db.deadline.create({
    data: {
      organizationId: session.user.organizationId,
      processId: process.id,
      responsibleId,
      type: parsed.data.type,
      legalBasis: parsed.data.legalBasis || null,
      intimationDate,
      days: parsed.data.days,
      dueDate,
      calculationConfidence,
      notes: parsed.data.notes || null,
    },
  })

  await logEvent({
    organizationId: session.user.organizationId,
    actorId: session.user.id,
    type: "DEADLINE_CREATED",
    processId: process.id,
    deadlineId: deadline.id,
    metadata: { type: deadline.type, dueDate: dueDate.toISOString() },
  })

  revalidatePath("/prazos")
  revalidatePath("/processos")
  revalidatePath("/dashboard")

  return { success: true, data: undefined }
}

export async function updateDeadlineAction(input: UpdateDeadlineInput): Promise<ActionResult> {
  const session = await requireSession()
  const parsed = updateDeadlineSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  const existing = await db.deadline.findFirst({
    where: { id: parsed.data.id, organizationId: session.user.organizationId, deletedAt: null },
  })
  if (!existing) {
    return { success: false, error: "Prazo não encontrado" }
  }

  const process = await db.process.findFirst({
    where: {
      id: parsed.data.processId,
      organizationId: session.user.organizationId,
      deletedAt: null,
    },
  })
  if (!process) {
    return { success: false, error: "Processo não encontrado" }
  }

  const responsibleId = await assertResponsibleBelongsToOrg(
    session.user.organizationId,
    parsed.data.responsibleId
  )

  const intimationDate = parseLocalDate(parsed.data.intimationDate)
  const { dueDate, calculationConfidence } = calculateDeadline({
    intimationDate,
    days: parsed.data.days,
    county: process.county,
  })

  await db.deadline.update({
    where: { id: existing.id },
    data: {
      processId: process.id,
      responsibleId: responsibleId ?? null,
      type: parsed.data.type,
      legalBasis: parsed.data.legalBasis || null,
      intimationDate,
      days: parsed.data.days,
      dueDate,
      calculationConfidence,
      notes: parsed.data.notes || null,
    },
  })

  await logEvent({
    organizationId: session.user.organizationId,
    actorId: session.user.id,
    type: "DEADLINE_UPDATED",
    processId: process.id,
    deadlineId: existing.id,
    metadata: { type: parsed.data.type, dueDate: dueDate.toISOString() },
  })

  revalidatePath("/prazos")
  revalidatePath("/processos")
  revalidatePath("/dashboard")

  return { success: true, data: undefined }
}

export async function deleteDeadlineAction(id: string): Promise<ActionResult> {
  const session = await requireSession()

  const existing = await db.deadline.findFirst({
    where: { id, organizationId: session.user.organizationId, deletedAt: null },
  })
  if (!existing) {
    return { success: false, error: "Prazo não encontrado" }
  }

  await db.deadline.update({ where: { id }, data: { deletedAt: new Date() } })

  await logEvent({
    organizationId: session.user.organizationId,
    actorId: session.user.id,
    type: "DEADLINE_DELETED",
    processId: existing.processId,
    deadlineId: existing.id,
  })

  revalidatePath("/prazos")
  revalidatePath("/processos")
  revalidatePath("/dashboard")

  return { success: true, data: undefined }
}

export async function completeDeadlineAction(id: string): Promise<ActionResult> {
  const session = await requireSession()

  const existing = await db.deadline.findFirst({
    where: { id, organizationId: session.user.organizationId, deletedAt: null },
  })
  if (!existing) {
    return { success: false, error: "Prazo não encontrado" }
  }

  await db.deadline.update({
    where: { id },
    data: { status: "COMPLETED", completedAt: new Date() },
  })

  await logEvent({
    organizationId: session.user.organizationId,
    actorId: session.user.id,
    type: "DEADLINE_COMPLETED",
    processId: existing.processId,
    deadlineId: existing.id,
  })

  revalidatePath("/prazos")
  revalidatePath("/dashboard")

  return { success: true, data: undefined }
}
