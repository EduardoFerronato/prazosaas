import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronRight } from "lucide-react"

import { DeadlineStatusBadge } from "@/modules/deadlines/status-badge"
import type { DeadlineStatus } from "@/generated/prisma/client"

export function DeadlineRow({
  type,
  processNumber,
  processClient,
  dueDate,
  status,
  relativeLabel,
}: {
  type: string
  processNumber: string
  processClient: string
  dueDate: Date
  status: DeadlineStatus
  relativeLabel?: string
}) {
  return (
    <Link
      href="/prazos"
      className="hover:bg-muted/50 group flex items-center justify-between gap-4 px-5 py-3.5 transition-colors"
    >
      <div className="min-w-0">
        <p className="text-[15px] font-medium">{type}</p>
        <p className="text-muted-foreground mt-0.5 truncate text-sm">
          {processNumber} · {processClient}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">
            {relativeLabel ?? format(dueDate, "dd/MM/yyyy", { locale: ptBR })}
          </p>
          {relativeLabel ? (
            <p className="text-muted-foreground text-xs">
              {format(dueDate, "dd/MM/yyyy", { locale: ptBR })}
            </p>
          ) : null}
        </div>
        <DeadlineStatusBadge status={status} />
        <ChevronRight className="text-muted-foreground size-4 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  )
}
