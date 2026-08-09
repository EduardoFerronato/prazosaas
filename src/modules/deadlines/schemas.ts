import { z } from "zod"

export const deadlineSchema = z.object({
  processId: z.string().min(1, "Selecione o processo"),
  type: z.string().trim().min(1, "Informe o tipo do prazo"),
  legalBasis: z.string().trim().optional(),
  intimationDate: z.string().min(1, "Informe a data da intimação"),
  days: z.number().int().min(1, "Informe a quantidade de dias").max(365),
  responsibleId: z.string().optional(),
  notes: z.string().trim().optional(),
})

export const updateDeadlineSchema = deadlineSchema.extend({
  id: z.string(),
})

export type DeadlineInput = z.infer<typeof deadlineSchema>
export type UpdateDeadlineInput = z.infer<typeof updateDeadlineSchema>
