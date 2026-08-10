import type { Metadata } from "next"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarClock, Clock, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react"

import { getCurrentUser } from "@/modules/auth/queries"
import { getDeadlineCounts, listUpcomingDeadlines } from "@/modules/deadlines/queries"
import { DeadlineStatusBadge } from "@/modules/deadlines/status-badge"

export const metadata: Metadata = { title: "Dashboard" }

const STAT_CARDS = [
  {
    key: "pending" as const,
    label: "Pendentes",
    icon: Clock,
    iconClassName: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  },
  {
    key: "missed" as const,
    label: "Perdidos",
    icon: AlertTriangle,
    iconClassName: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  },
  {
    key: "completed" as const,
    label: "Concluídos",
    icon: CheckCircle2,
    iconClassName: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
]

export default async function DashboardPage() {
  const [user, counts, upcoming] = await Promise.all([
    getCurrentUser(),
    getDeadlineCounts(),
    listUpcomingDeadlines(),
  ])

  const hasAnyDeadline = counts.pending + counts.missed + counts.completed > 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Olá, {user.name.split(" ")[0]}</h1>
        <p className="text-muted-foreground mt-1 text-base">
          Aqui está o resumo dos seus prazos.
        </p>
      </div>

      {hasAnyDeadline ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {STAT_CARDS.map((card) => (
              <div
                key={card.key}
                className="bg-card flex items-center gap-4 rounded-xl border p-5"
              >
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-full ${card.iconClassName}`}
                >
                  <card.icon className="size-6" />
                </div>
                <div>
                  <p className="text-3xl font-semibold tabular-nums sm:text-4xl">
                    {counts[card.key]}
                  </p>
                  <p className="text-muted-foreground text-sm">{card.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold tracking-tight">Próximos vencimentos</h2>
            {upcoming.length ? (
              <div className="divide-y rounded-xl border">
                {upcoming.map((deadline) => (
                  <Link
                    key={deadline.id}
                    href="/prazos"
                    className="hover:bg-muted/50 group flex items-center justify-between gap-4 px-5 py-4 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-base font-medium">{deadline.type}</p>
                      <p className="text-muted-foreground mt-0.5 truncate text-sm">
                        {deadline.process.number} · {deadline.process.client}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <span className="text-muted-foreground text-sm">
                        {format(deadline.dueDate, "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                      <DeadlineStatusBadge status={deadline.status} />
                      <ChevronRight className="text-muted-foreground size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground rounded-xl border border-dashed p-8 text-center text-base">
                Nenhum prazo pendente no momento.
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-center">
          <CalendarClock className="text-muted-foreground size-9" />
          <div className="space-y-1.5">
            <p className="text-base font-medium">Nenhum prazo cadastrado ainda</p>
            <p className="text-muted-foreground max-w-sm text-base">
              Cadastre seu primeiro processo para começar a acompanhar prazos aqui.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
