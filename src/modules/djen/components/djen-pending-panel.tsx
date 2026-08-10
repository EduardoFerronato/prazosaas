"use client"

import { useState, useTransition } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Loader2, RefreshCw, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { syncDjenAction, dismissDjenItemAction } from "@/modules/djen/actions"
import { stripHtml } from "@/modules/djen/strip-html"
import { ImportDjenItemDialog } from "@/modules/djen/components/import-djen-item-dialog"
import type { DjenImportListItem } from "@/modules/djen/queries"

export function DjenPendingPanel({
  items,
  members,
  hasOab,
}: {
  items: DjenImportListItem[]
  members: { id: string; name: string }[]
  hasOab: boolean
}) {
  const [isSyncing, startSyncTransition] = useTransition()
  const [dismissingId, setDismissingId] = useState<string | null>(null)
  const [isDismissing, startDismissTransition] = useTransition()
  const [importingItem, setImportingItem] = useState<DjenImportListItem | null>(null)

  function handleSync() {
    startSyncTransition(async () => {
      const result = await syncDjenAction()
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(
        result.data.found > 0
          ? `${result.data.found} nova(s) comunicação(ões) encontrada(s) no DJEN.`
          : "Nenhuma novidade no DJEN desde a última busca."
      )
    })
  }

  function handleDismiss(id: string) {
    setDismissingId(id)
    startDismissTransition(async () => {
      const result = await dismissDjenItemAction(id)
      if (!result.success) {
        toast.error(result.error)
      }
      setDismissingId(null)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium">Comunicações do DJEN</h2>
          <p className="text-muted-foreground text-xs">
            {hasOab
              ? "Busca pública de intimações vinculadas à sua OAB."
              : "Cadastre sua OAB em Configurações para buscar automaticamente."}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSync} disabled={isSyncing || !hasOab}>
          {isSyncing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
          Buscar novidades
        </Button>
      </div>

      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 rounded-lg border p-3"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm">{item.numeroProcesso}</span>
                  <Badge variant="outline">{item.tribunal}</Badge>
                  <Badge variant="secondary">{item.tipoComunicacao}</Badge>
                  <span className="text-muted-foreground text-xs">
                    {format(item.dataDisponibilizacao, "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
                <p className="text-muted-foreground line-clamp-2 text-xs">
                  {stripHtml(item.texto)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button size="sm" onClick={() => setImportingItem(item)}>
                  Importar
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label="Dispensar"
                  onClick={() => handleDismiss(item.id)}
                  disabled={isDismissing && dismissingId === item.id}
                >
                  {isDismissing && dismissingId === item.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <X className="size-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {importingItem ? (
        <ImportDjenItemDialog
          item={importingItem}
          members={members}
          open={!!importingItem}
          onOpenChange={(open) => !open && setImportingItem(null)}
        />
      ) : null}
    </div>
  )
}
