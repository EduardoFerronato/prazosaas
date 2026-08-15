import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type MetricTone = "neutral" | "danger" | "success" | "info"

const TONE_STYLES: Record<MetricTone, { container: string; label: string }> = {
  neutral: {
    container: "bg-card border-border",
    label: "text-muted-foreground",
  },
  danger: {
    container: "bg-red-50/60 border-red-200 dark:bg-red-500/5 dark:border-red-500/25",
    label: "text-red-600 dark:text-red-400",
  },
  success: {
    container: "bg-emerald-50/60 border-emerald-200 dark:bg-emerald-500/5 dark:border-emerald-500/25",
    label: "text-emerald-600 dark:text-emerald-400",
  },
  info: {
    container: "bg-blue-50/60 border-blue-200 dark:bg-blue-500/5 dark:border-blue-500/25",
    label: "text-blue-600 dark:text-blue-400",
  },
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  subtext,
}: {
  label: string
  value: string | number
  icon: LucideIcon
  tone?: MetricTone
  subtext?: string
}) {
  const styles = TONE_STYLES[tone]

  return (
    <div className={cn("rounded-xl border p-5 transition-colors", styles.container)}>
      <div className={cn("flex items-center gap-1.5 text-sm font-medium", styles.label)}>
        <Icon className="size-4" />
        {label}
      </div>
      <p className="text-foreground mt-3 text-4xl font-semibold tabular-nums">{value}</p>
      {subtext ? <p className="text-muted-foreground mt-1.5 text-sm">{subtext}</p> : null}
    </div>
  )
}
