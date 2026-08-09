/**
 * Cobertura certificada do motor de cálculo (decisão de escopo do MVP): apenas
 * capitais estaduais, o Distrito Federal e a Justiça Federal têm feriados forenses
 * mapeados com confiança. Fora dessa lista, o prazo é calculado como sugestão, mas
 * marcado como MANUAL — o usuário precisa confirmar a data manualmente, porque
 * feriados municipais locais não estão cobertos.
 */

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase()
}

const CERTIFIED_COUNTIES = new Set(
  [
    "São Paulo",
    "Rio de Janeiro",
    "Belo Horizonte",
    "Porto Alegre",
    "Curitiba",
    "Salvador",
    "Recife",
    "Fortaleza",
    "Brasília",
    "Distrito Federal",
    "Goiânia",
    "Belém",
    "Manaus",
    "Vitória",
    "Florianópolis",
    "Natal",
    "João Pessoa",
    "Maceió",
    "Aracaju",
    "Teresina",
    "São Luís",
    "Cuiabá",
    "Campo Grande",
    "Porto Velho",
    "Rio Branco",
    "Boa Vista",
    "Macapá",
    "Palmas",
    "Justiça Federal",
  ].map(normalize)
)

export function isCertifiedCoverage(county: string): boolean {
  return CERTIFIED_COUNTIES.has(normalize(county))
}
