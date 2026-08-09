import type { Metadata } from "next"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarClock, Clock, AlertTriangle, CheckCircle2 } from "lucide-react"

import { auth } from "@/lib/auth"
import { getDeadlineCounts, listUpcomingDeadlines } from "@/modules/deadlines/queries"
import { DeadlineStatusBadge } from "@/modules/deadlines/status-badge"

export const metadata: Metadata = { title: "Dashboard" }

export default async function DashboardPage() {
  const session = await auth()
  const [counts, upcoming] = await Promise.all([getDeadlineCounts(), listUpcomingDeadlines()])

  const hasAnyDeadline = counts.pending + counts.missed + counts.completed > 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Olá, {session?.user?.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground text-sm">Aqui está o resumo dos seus prazos.</p>
      </div>

      {hasAnyDeadline ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-muted flex items-center gap-3 rounded-lg p-4">
              <Clock className="text-muted-foreground size-5" />
              <div>
                <p className="text-2xl font-semibold tabular-nums">{counts.pending}</p>
                <p className="text-muted-foreground text-xs">Pendentes</p>
              </div>
            </div>
            <div className="bg-muted flex items-center gap-3 rounded-lg p-4">
              <AlertTriangle className="text-destructive size-5" />
              <div>
                <p className="text-2xl font-semibold tabular-nums">{counts.missed}</p>
                <p className="text-muted-foreground text-xs">Perdidos</p>
              </div>
            </div>
            <div className="bg-muted flex items-center gap-3 rounded-lg p-4">
              <CheckCircle2 className="size-5 text-emerald-600" />
              <div>
                <p className="text-2xl font-semibold tabular-nums">{counts.completed}</p>
                <p className="text-muted-foreground text-xs">Concluídos</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-medium">Próximos vencimentos</h2>
            {upcoming.length ? (
              <div className="divide-y rounded-lg border">
                {upcoming.map((deadline) => (
                  <Link
                    key={deadline.id}
                    href="/prazos"
                    className="hover:bg-muted/50 flex items-center justify-between px-4 py-3 text-sm transition-colors"
                  >
                    <div>
                      <p className="font-medium">{deadline.type}</p>
                      <p className="text-muted-foreground text-xs">
                        {deadline.process.number} · {deadline.process.client}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-xs">
                        {format(deadline.dueDate, "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                      <DeadlineStatusBadge status={deadline.status} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
                Nenhum prazo pendente no momento.
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-lg border border-dashed text-center">
          <CalendarClock className="text-muted-foreground size-8" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Nenhum prazo cadastrado ainda</p>
            <p className="text-muted-foreground max-w-sm text-sm">
              Cadastre seu primeiro processo para começar a acompanhar prazos aqui.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
