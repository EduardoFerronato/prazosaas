"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ShieldCheck, TriangleAlert } from "lucide-react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { DeadlineListItem } from "@/modules/deadlines/queries"
import { DeadlineStatusBadge } from "@/modules/deadlines/status-badge"
import { DeadlineRowActions } from "@/modules/deadlines/components/deadline-row-actions"
import type { ProcessOption } from "@/modules/processes/queries"

export function getDeadlineColumns(
  processes: ProcessOption[],
  members: { id: string; name: string }[]
): ColumnDef<DeadlineListItem>[] {
  return [
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
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                ) : (
                  <TriangleAlert className="size-3.5 text-amber-500" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                {isCertified
                  ? "Cálculo certificado para esta comarca"
                  : "Fora da cobertura certificada — confira esta data manualmente"}
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
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DeadlineRowActions deadline={row.original} processes={processes} members={members} />
      ),
    },
  ]
}
