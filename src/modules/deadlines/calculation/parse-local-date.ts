/**
 * `new Date("2026-08-03")` é interpretado como UTC (meia-noite), não hora local —
 * um erro clássico do JS que desalinha o cálculo em fusos diferentes de UTC+0
 * (todo o Brasil, por exemplo). Datas vindas de um <input type="date"> (formato
 * "YYYY-MM-DD") devem sempre ser interpretadas como meio-dia local, nunca via UTC.
 */
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number)
  return new Date(year, month - 1, day)
}
