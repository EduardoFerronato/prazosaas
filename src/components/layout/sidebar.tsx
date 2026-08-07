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
    <aside className="bg-sidebar text-sidebar-foreground hidden w-60 shrink-0 flex-col border-r px-3 py-4 md:flex">
      <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm font-medium">
        <ShieldCheck className="size-5" />
        <span>Prazo Certo</span>
      </Link>

      <nav className="mt-6 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
