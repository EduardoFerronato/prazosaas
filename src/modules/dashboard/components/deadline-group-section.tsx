import { cn } from "@/lib/utils"
import { DeadlineRow } from "@/modules/dashboard/components/deadline-row"
import type { DeadlineStatus } from "@/generated/prisma/client"

export interface DeadlineGroupItem {
  id: string
  type: string
  processNumber: string
  processClient: string
  dueDate: Date
  status: DeadlineStatus
  relativeLabel?: string
}

export function DeadlineGroupSection({
  title,
  items,
  tone = "default",
}: {
  title: string
  items: DeadlineGroupItem[]
  tone?: "default" | "danger"
}) {
  if (!items.length) return null

  return (
    <div>
      <h3
        className={cn(
          "px-5 pt-4 pb-2 text-xs font-semibold tracking-wide uppercase",
          tone === "danger" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
        )}
      >
        {title}
      </h3>
      <div className="divide-y">
        {items.map((item) => (
          <DeadlineRow
            key={item.id}
            type={item.type}
            processNumber={item.processNumber}
            processClient={item.processClient}
            dueDate={item.dueDate}
            status={item.status}
            relativeLabel={item.relativeLabel}
          />
        ))}
      </div>
    </div>
  )
}
