import "server-only"

const DJEN_BASE_URL = "https://comunicaapi.pje.jus.br/api/v1/comunicacao"

export interface DjenComunicacao {
  id: number
  hash: string
  numero_processo: string
  numeroprocessocommascara: string
  siglaTribunal: string
  nomeOrgao: string
  tipoComunicacao: string
  texto: string
  link: string | null
  data_disponibilizacao: string // formato yyyy-mm-dd
  destinatarios: { nome: string; polo: string }[]
}

interface DjenResponse {
  status: string
  message?: string
  count: number
  items: DjenComunicacao[]
}

export interface SearchDjenParams {
  numeroOab: string
  ufOab: string
  dataInicio: string // yyyy-mm-dd
  dataFim: string // yyyy-mm-dd
}

/**
 * API pública do DJEN (CNJ, Res. 455/2022) — não exige autenticação para consulta.
 * Sujeita a rate limit por IP; ver cabeçalhos x-ratelimit-* na resposta.
 * Doc: https://comunicaapi.pje.jus.br (Swagger, /swagger/djen.yml)
 */
export async function searchDjenComunicacoes({
  numeroOab,
  ufOab,
  dataInicio,
  dataFim,
}: SearchDjenParams): Promise<DjenComunicacao[]> {
  const url = new URL(DJEN_BASE_URL)
  url.searchParams.set("numeroOab", numeroOab)
  url.searchParams.set("ufOab", ufOab)
  url.searchParams.set("dataDisponibilizacaoInicio", dataInicio)
  url.searchParams.set("dataDisponibilizacaoFim", dataFim)
  url.searchParams.set("itensPorPagina", "100")

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  })

  if (response.status === 429) {
    throw new Error("Limite de consultas ao DJEN atingido. Tente novamente em alguns minutos.")
  }
  if (!response.ok) {
    throw new Error(`DJEN respondeu ${response.status}`)
  }

  const data = (await response.json()) as DjenResponse
  return data.items ?? []
}
