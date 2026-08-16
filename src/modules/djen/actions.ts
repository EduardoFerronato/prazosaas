"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { requireSession } from "@/lib/session"
import { logEvent } from "@/modules/events/log"
import { searchDjenComunicacoes } from "@/modules/djen/client"
import { parseLocalDate } from "@/modules/deadlines/calculation/parse-local-date"
import { oabSchema, importDjenItemSchema, type OabInput, type ImportDjenItemInput } from "@/modules/djen/schemas"
import type { ActionResult } from "@/lib/action-result"

const SYNC_WINDOW_DAYS = 30

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

export async function updateOabAction(input: OabInput): Promise<ActionResult> {
  const session = await requireSession()
  const parsed = oabSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      oabNumber: parsed.data.oabNumber || null,
      oabUf: parsed.data.oabUf || null,
    },
  })

  revalidatePath("/configuracoes")

  return { success: true, data: undefined }
}

export async function syncDjenAction(): Promise<ActionResult<{ found: number }>> {
  const session = await requireSession()

  const user = await db.user.findUniqueOrThrow({ where: { id: session.user.id } })
  if (!user.oabNumber || !user.oabUf) {
    return { success: false, error: "Cadastre sua OAB em Configurações antes de sincronizar." }
  }

  const today = new Date()
  const defaultStart = new Date(today.getTime() - SYNC_WINDOW_DAYS * 24 * 60 * 60 * 1000)
  const start = user.djenLastSyncAt && user.djenLastSyncAt > defaultStart ? user.djenLastSyncAt : defaultStart

  let items
  try {
    items = await searchDjenComunicacoes({
      numeroOab: user.oabNumber,
      ufOab: user.oabUf,
      dataInicio: formatDate(start),
      dataFim: formatDate(today),
    })
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao consultar o DJEN",
    }
  }

  let created = 0
  for (const item of items) {
    const exists = await db.djenImport.findUnique({ where: { djenHash: item.hash } })
    if (exists) continue

    await db.djenImport.create({
      data: {
        organizationId: session.user.organizationId,
        userId: session.user.id,
        djenHash: item.hash,
        numeroProcesso: item.numeroprocessocommascara || item.numero_processo,
        tribunal: item.siglaTribunal,
        orgao: item.nomeOrgao,
        tipoComunicacao: item.tipoComunicacao,
        texto: item.texto,
        dataDisponibilizacao: parseLocalDate(item.data_disponibilizacao),
        link: item.link,
      },
    })
    created++
  }

  await db.user.update({ where: { id: session.user.id }, data: { djenLastSyncAt: today } })

  revalidatePath("/processos")
  revalidatePath("/dashboard")

  return { success: true, data: { found: created } }
}

export async function importDjenItemAction(input: ImportDjenItemInput): Promise<ActionResult> {
  const session = await requireSession()
  const parsed = importDjenItemSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  const pending = await db.djenImport.findFirst({
    where: { id: parsed.data.id, organizationId: session.user.organizationId, status: "PENDING" },
  })
  if (!pending) {
    return { success: false, error: "Comunicação não encontrada" }
  }

  let responsibleId: string | undefined
  if (parsed.data.responsibleId) {
    const membership = await db.membership.findFirst({
      where: { organizationId: session.user.organizationId, userId: parsed.data.responsibleId },
      select: { userId: true },
    })
    responsibleId = membership?.userId
  }

  const process = await db.$transaction(async (tx) => {
    const created = await tx.process.create({
      data: {
        organizationId: session.user.organizationId,
        number: pending.numeroProcesso,
        client: parsed.data.client,
        court: pending.tribunal,
        county: parsed.data.county,
        type: parsed.data.type,
        responsibleId,
        notes: `Importado do DJEN (${pending.tipoComunicacao}, ${pending.orgao}).`,
      },
    })

    await tx.djenImport.update({
      where: { id: pending.id },
      data: { status: "IMPORTED", processId: created.id },
    })

    return created
  })

  await logEvent({
    organizationId: session.user.organizationId,
    actorId: session.user.id,
    type: "PROCESS_CREATED",
    processId: process.id,
    metadata: { number: process.number, source: "djen" },
  })

  revalidatePath("/processos")

  return { success: true, data: undefined }
}

export async function dismissDjenItemAction(id: string): Promise<ActionResult> {
  const session = await requireSession()

  const pending = await db.djenImport.findFirst({
    where: { id, organizationId: session.user.organizationId, status: "PENDING" },
  })
  if (!pending) {
    return { success: false, error: "Comunicação não encontrada" }
  }

  await db.djenImport.update({ where: { id }, data: { status: "DISMISSED" } })

  revalidatePath("/processos")

  return { success: true, data: undefined }
}
