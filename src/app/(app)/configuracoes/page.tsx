import type { Metadata } from "next"

export const metadata: Metadata = { title: "Configurações" }

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
      <p className="text-muted-foreground text-sm">Em construção — próxima etapa do build.</p>
    </div>
  )
}
