import { z } from "zod"

export const processSchema = z.object({
  number: z.string().trim().min(3, "Informe o número do processo"),
  client: z.string().trim().min(2, "Informe o nome do cliente"),
  court: z.string().trim().min(1, "Informe o tribunal"),
  county: z.string().trim().min(1, "Informe a comarca"),
  type: z.string().trim().min(1, "Informe o tipo de ação"),
  responsibleId: z.string().optional(),
  notes: z.string().trim().optional(),
})

export const updateProcessSchema = processSchema.extend({
  id: z.string(),
})

export type ProcessInput = z.infer<typeof processSchema>
export type UpdateProcessInput = z.infer<typeof updateProcessSchema>
