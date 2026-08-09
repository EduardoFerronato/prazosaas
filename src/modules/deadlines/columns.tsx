"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ShieldCheck, PencilLine } from "lucide-react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { DeadlineListItem } from "@/modules/deadlines/queries"
import { DeadlineStatusBadge } from "@/modules/deadlines/status-badge"

export const deadlineColumns: ColumnDef<DeadlineListItem>[] = [
  {
    id: "process",
    header: "Processo",
    cell: ({ row }) => (
      <div>
        <p className="font-mono text-sm">{row.original.process.number}</p>
        <p className="text-muted-foreground text-xs">{row.original.process.client}</p>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipo de prazo",
  },
  {
    id: "dueDate",
    header: "Vencimento",
    cell: ({ row }) => {
      const isCertified = row.original.calculationConfidence === "CERTIFIED"
      return (
        <div className="flex items-center gap-1.5">
          <span>{format(row.original.dueDate, "dd/MM/yyyy", { locale: ptBR })}</span>
          <Tooltip>
            <TooltipTrigger>
              {isCertified ? (
                <ShieldCheck className="text-emerald-600 size-3.5" />
              ) : (
                <PencilLine className="text-muted-foreground size-3.5" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {isCertified
                ? "Cálculo certificado para esta comarca"
                : "Data confirmada manualmente (fora da cobertura certificada)"}
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <DeadlineStatusBadge status={row.original.status} />,
  },
  {
    id: "responsible",
    header: "Responsável",
    cell: ({ row }) => row.original.responsible?.name ?? "—",
  },
]
