import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

import { describeEvent } from "@/modules/events/format"
import type { RecentEvent } from "@/modules/events/queries"

export function ActivityFeed({ events }: { events: RecentEvent[] }) {
  if (!events.length) {
    return (
      <p className="text-muted-foreground px-5 py-6 text-sm">
        Nenhuma atividade registrada ainda.
      </p>
    )
  }

  return (
    <ul className="space-y-5 px-5 py-4">
      {events.map((event) => {
        const { icon: Icon, text } = describeEvent(event)
        return (
          <li key={event.id} className="flex items-start gap-3">
            <div className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-full">
              <Icon className="text-muted-foreground size-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm leading-snug">{text}</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {formatDistanceToNow(event.createdAt, { addSuffix: true, locale: ptBR })}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
