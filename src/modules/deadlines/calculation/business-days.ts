import { isForensicRecess, isNationalHoliday } from "./holidays"

function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function isBusinessDay(date: Date): boolean {
  return !isWeekend(date) && !isNationalHoliday(date) && !isForensicRecess(date)
}

/**
 * Conta apenas dias úteis a partir de `start`, excluindo o dia inicial (art. 224, CPC:
 * exclui o dia do começo, inclui o dia do vencimento) e pulando fins de semana, feriados
 * nacionais e o recesso forense.
 */
export function addBusinessDays(start: Date, days: number): Date {
  let current = new Date(start)
  let counted = 0

  while (counted < days) {
    current = new Date(current)
    current.setDate(current.getDate() + 1)
    if (isBusinessDay(current)) {
      counted++
    }
  }

  return current
}
