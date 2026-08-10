"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Scale, CalendarClock, Settings, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/processos", label: "Processos", icon: Scale },
  { href: "/prazos", label: "Prazos", icon: CalendarClock },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-sidebar text-sidebar-foreground hidden w-64 shrink-0 flex-col border-r px-3 py-5 md:flex">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-base font-semibold">
        <ShieldCheck className="size-6 text-blue-600 dark:text-blue-400" />
        <span>Prazo Certo</span>
      </Link>

      <nav className="mt-8 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              {isActive ? (
                <span className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full bg-blue-600 dark:bg-blue-400" />
              ) : null}
              <item.icon className="size-[18px]" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
