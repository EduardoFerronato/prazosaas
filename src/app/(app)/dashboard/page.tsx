import type { Metadata } from "next"
import Link from "next/link"
import { isToday, isThisWeek, differenceInCalendarDays, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Clock, AlertTriangle, CheckCircle2, Gauge, CalendarClock, Inbox, ArrowRight } from "lucide-react"

import { getCurrentUser } from "@/modules/auth/queries"
import {
  getDeadlineCounts,
  listUpcomingDeadlines,
  listOverdueDeadlines,
} from "@/modules/deadlines/queries"
import { listRecentEvents } from "@/modules/events/queries"
import { listProcessOptions } from "@/modules/processes/queries"
import { listOrganizationMembers } from "@/modules/organizations/queries"
import { countPendingDjenImports } from "@/modules/djen/queries"
import { SyncDjenButton } from "@/modules/djen/components/sync-djen-button"
import { MetricCard } from "@/modules/dashboard/components/metric-card"
import {
  DeadlineGroupSection,
  type DeadlineGroupItem,
} from "@/modules/dashboard/components/deadline-group-section"
import { ActivityFeed } from "@/modules/dashboard/components/activity-feed"
import { NewDeadlineButton } from "@/modules/deadlines/components/new-deadline-button"

export const metadata: Metadata = { title: "Dashboard" }

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export default async function DashboardPage() {
  const [user, counts, upcoming, overdue, events, processes, members, pendingDjenCount] =
    await Promise.all([
      getCurrentUser(),
      getDeadlineCounts(),
      listUpcomingDeadlines(20),
      listOverdueDeadlines(),
      listRecentEvents(6),
      listProcessOptions(),
      listOrganizationMembers(),
      countPendingDjenImports(),
    ])

  const hasOab = !!(user.oabNumber && user.oabUf)

  const hasAnyDeadline = counts.pending + counts.missed + counts.completed > 0

  const overdueItems: DeadlineGroupItem[] = overdue.map((d) => {
    const days = differenceInCalendarDays(new Date(), d.dueDate)
    return {
      id: d.id,
      type: d.type,
      processNumber: d.process.number,
      processClient: d.process.client,
      dueDate: d.dueDate,
      status: d.status,
      relativeLabel: days <= 0 ? "Hoje" : days === 1 ? "Há 1 dia" : `Há ${days} dias`,
    }
  })

  const todayItems: DeadlineGroupItem[] = []
  const thisWeekItems: DeadlineGroupItem[] = []
  const laterItems: DeadlineGroupItem[] = []

  for (const d of upcoming) {
    const item: DeadlineGroupItem = {
      id: d.id,
      type: d.type,
      processNumber: d.process.number,
      processClient: d.process.client,
      dueDate: d.dueDate,
      status: d.status,
    }

    if (isToday(d.dueDate)) {
      todayItems.push({ ...item, relativeLabel: "Hoje" })
    } else if (isThisWeek(d.dueDate, { weekStartsOn: 1 })) {
      thisWeekItems.push({ ...item, relativeLabel: capitalize(format(d.dueDate, "EEEE", { locale: ptBR })) })
    } else {
      laterItems.push(item)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Visão geral
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Olá, {user.name.split(" ")[0]}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <SyncDjenButton hasOab={hasOab} />
          <NewDeadlineButton processes={processes} members={members} />
        </div>
      </div>

      {pendingDjenCount > 0 ? (
        <Link
          href="/processos"
          className="flex items-center justify-between gap-4 rounded-xl border border-blue-200 bg-blue-50/60 px-5 py-3.5 transition-colors hover:bg-blue-50 dark:border-blue-500/25 dark:bg-blue-500/5 dark:hover:bg-blue-500/10"
        >
          <div className="flex items-center gap-3">
            <Inbox className="size-4 text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
              {pendingDjenCount} comunicaç{pendingDjenCount === 1 ? "ão" : "ões"} do DJEN
              aguardando revisão
            </p>
          </div>
          <ArrowRight className="size-4 text-blue-600 dark:text-blue-400" />
        </Link>
      ) : null}

      {hasAnyDeadline ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Pendentes"
              value={counts.pending}
              icon={Clock}
              tone={counts.pending > 0 ? "info" : "neutral"}
            />
            <MetricCard
              label="Perdidos"
              value={counts.missed}
              icon={AlertTriangle}
              tone={counts.missed > 0 ? "danger" : "neutral"}
            />
            <MetricCard
              label="Concluídos"
              value={counts.completed}
              icon={CheckCircle2}
              tone={counts.completed > 0 ? "success" : "neutral"}
            />
            <MetricCard
              label="Taxa de cumprimento"
              value={counts.complianceRate === null ? "—" : `${counts.complianceRate}%`}
              icon={Gauge}
              tone="neutral"
              subtext="prazos concluídos no prazo"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-xl border lg:col-span-2">
              <div className="flex items-center justify-between px-5 pt-5">
                <h2 className="text-lg font-semibold tracking-tight">Prazos</h2>
              </div>
              {overdueItems.length || todayItems.length || thisWeekItems.length || laterItems.length ? (
                <div className="divide-y">
                  <DeadlineGroupSection title="Atrasados" items={overdueItems} tone="danger" />
                  <DeadlineGroupSection title="Vence hoje" items={todayItems} />
                  <DeadlineGroupSection title="Esta semana" items={thisWeekItems} />
                  <DeadlineGroupSection title="Mais tarde" items={laterItems} />
                </div>
              ) : (
                <p className="text-muted-foreground px-5 py-8 text-center text-base">
                  Nenhum prazo pendente no momento.
                </p>
              )}
            </div>

            <div className="rounded-xl border">
              <h2 className="px-5 pt-5 text-lg font-semibold tracking-tight">Atividade recente</h2>
              <ActivityFeed events={events} />
            </div>
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
