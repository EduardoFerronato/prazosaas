import { z } from "zod"

export const BRAZILIAN_UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const

export const oabSchema = z.object({
  oabNumber: z.string().trim().regex(/^\d+$/, "Informe apenas os números da OAB").optional().or(z.literal("")),
  oabUf: z.enum(BRAZILIAN_UFS).optional().or(z.literal("")),
})

export const importDjenItemSchema = z.object({
  id: z.string(),
  client: z.string().trim().min(2, "Informe o nome do cliente"),
  county: z.string().trim().min(1, "Informe a comarca"),
  type: z.string().trim().min(1, "Informe o tipo de ação"),
  responsibleId: z.string().optional(),
})

export type OabInput = z.infer<typeof oabSchema>
export type ImportDjenItemInput = z.infer<typeof importDjenItemSchema>
