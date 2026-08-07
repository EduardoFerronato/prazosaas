import type { Metadata } from "next"

export const metadata: Metadata = { title: "Prazos" }

export default function DeadlinesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Prazos</h1>
      <p className="text-muted-foreground text-sm">Em construção — próxima etapa do build.</p>
    </div>
  )
}
