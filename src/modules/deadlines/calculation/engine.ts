import type { CalculationConfidence } from "@/generated/prisma/client"
import { addBusinessDays } from "./business-days"
import { isCertifiedCoverage } from "./coverage"

export interface CalculateDeadlineInput {
  intimationDate: Date
  days: number
  county: string
}

export interface CalculateDeadlineResult {
  dueDate: Date
  calculationConfidence: CalculationConfidence
}

/**
 * Calcula a data de vencimento em dias úteis a partir da intimação (art. 219 e 224, CPC).
 * A confiança do cálculo reflete a cobertura de feriados forenses conhecida (ver coverage.ts) —
 * fora da cobertura certificada, a data é uma sugestão que precisa de confirmação manual.
 */
export function calculateDeadline({
  intimationDate,
  days,
  county,
}: CalculateDeadlineInput): CalculateDeadlineResult {
  const dueDate = addBusinessDays(intimationDate, days)
  const calculationConfidence: CalculationConfidence = isCertifiedCoverage(county)
    ? "CERTIFIED"
    : "MANUAL"

  return { dueDate, calculationConfidence }
}
