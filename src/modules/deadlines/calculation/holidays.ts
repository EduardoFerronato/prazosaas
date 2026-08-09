/**
 * Feriados nacionais forenses e recesso do Judiciário (CNJ, Resolução 244/2016, art. 1º:
 * suspensão de prazos de 20/dez a 20/jan). Cobre apenas feriados NACIONAIS — feriados
 * estaduais/municipais ficam fora da cobertura certificada (ver coverage.ts).
 */

function calculateEasterSunday(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

/** Feriados nacionais forenses de um ano (fixos + móveis a partir da Páscoa). */
export function getNationalHolidays(year: number): Date[] {
  const easter = calculateEasterSunday(year)

  return [
    new Date(year, 0, 1), // Confraternização Universal
    addDays(easter, -47), // Carnaval (terça-feira)
    addDays(easter, -2), // Sexta-feira Santa
    addDays(easter, 60), // Corpus Christi
    new Date(year, 3, 21), // Tiradentes
    new Date(year, 4, 1), // Dia do Trabalho
    new Date(year, 8, 7), // Independência do Brasil
    new Date(year, 9, 12), // Nossa Senhora Aparecida
    new Date(year, 10, 2), // Finados
    new Date(year, 10, 15), // Proclamação da República
    new Date(year, 10, 20), // Consciência Negra (Lei 14.759/2023)
    new Date(year, 11, 25), // Natal
  ]
}

const holidayCache = new Map<number, Set<string>>()

function getHolidaySet(year: number): Set<string> {
  let cached = holidayCache.get(year)
  if (!cached) {
    cached = new Set(getNationalHolidays(year).map(dateKey))
    holidayCache.set(year, cached)
  }
  return cached
}

export function isNationalHoliday(date: Date): boolean {
  return getHolidaySet(date.getFullYear()).has(dateKey(date))
}

/** Recesso forense: 20/dez a 20/jan (inclusive), suspende prazos processuais. */
export function isForensicRecess(date: Date): boolean {
  const month = date.getMonth()
  const day = date.getDate()
  return (month === 11 && day >= 20) || (month === 0 && day <= 20)
}
