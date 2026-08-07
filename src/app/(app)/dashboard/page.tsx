import type { Metadata } from "next"
import { CalendarClock } from "lucide-react"
import { auth } from "@/lib/auth"

export const metadata: Metadata = { title: "Dashboard" }

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Olá, {session?.user?.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground text-sm">
          Aqui está o resumo dos seus prazos.
        </p>
      </div>

      <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-lg border border-dashed text-center">
        <CalendarClock className="text-muted-foreground size-8" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Nenhum prazo cadastrado ainda</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Cadastre seu primeiro processo para começar a acompanhar prazos aqui.
          </p>
        </div>
      </div>
    </div>
  )
}
