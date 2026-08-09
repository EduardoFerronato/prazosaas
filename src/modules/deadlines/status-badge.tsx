import { Badge } from "@/components/ui/badge"
import type { DeadlineStatus } from "@/generated/prisma/client"

const STATUS_CONFIG: Record<DeadlineStatus, { label: string; className: string }> = {
  PENDING: { label: "Pendente", className: "" },
  COMPLETED: {
    label: "Concluído",
    className: "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  MISSED: { label: "Perdido", className: "" },
  CANCELED: { label: "Cancelado", className: "" },
}

export function DeadlineStatusBadge({ status }: { status: DeadlineStatus }) {
  const config = STATUS_CONFIG[status]
  const variant = status === "MISSED" ? "destructive" : status === "CANCELED" ? "secondary" : "outline"

  return (
    <Badge variant={variant} className={config.className}>
      {config.label}
    </Badge>
  )
}
