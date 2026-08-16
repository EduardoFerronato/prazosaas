"use client"

import { useTransition } from "react"
import { Loader2, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { syncDjenAction } from "@/modules/djen/actions"

export function SyncDjenButton({
  hasOab,
  variant = "outline",
  onSynced,
}: {
  hasOab: boolean
  variant?: "outline" | "default"
  onSynced?: (found: number) => void
}) {
  const [isSyncing, startTransition] = useTransition()

  function handleSync() {
    startTransition(async () => {
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
      onSynced?.(result.data.found)
    })
  }

  const button = (
    <Button variant={variant} size="sm" onClick={handleSync} disabled={isSyncing || !hasOab}>
      {isSyncing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
      Atualizar processos
    </Button>
  )

  if (hasOab) return button

  return (
    <Tooltip>
      <TooltipTrigger render={<span />}>{button}</TooltipTrigger>
      <TooltipContent>Cadastre sua OAB em Configurações para buscar automaticamente.</TooltipContent>
    </Tooltip>
  )
}
