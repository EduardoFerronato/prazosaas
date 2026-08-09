"use client"

import { useState, useTransition } from "react"
import { Pencil, Trash2, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DeadlineForm } from "@/modules/deadlines/components/deadline-form"
import { deleteDeadlineAction, completeDeadlineAction } from "@/modules/deadlines/actions"
import type { DeadlineListItem } from "@/modules/deadlines/queries"
import type { ProcessOption } from "@/modules/processes/queries"

export function DeadlineRowActions({
  deadline,
  processes,
  members,
}: {
  deadline: DeadlineListItem
  processes: ProcessOption[]
  members: { id: string; name: string }[]
}) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, startDeleteTransition] = useTransition()
  const [isCompleting, startCompleteTransition] = useTransition()

  function handleDelete() {
    startDeleteTransition(async () => {
      const result = await deleteDeadlineAction(deadline.id)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success("Prazo excluído.")
      setDeleteOpen(false)
    })
  }

  function handleComplete() {
    startCompleteTransition(async () => {
      const result = await completeDeadlineAction(deadline.id)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success("Prazo marcado como concluído.")
    })
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {deadline.status === "PENDING" ? (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="Marcar como concluído"
                onClick={handleComplete}
                disabled={isCompleting}
              />
            }
          >
            {isCompleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check className="size-4 text-emerald-600" />
            )}
          </TooltipTrigger>
          <TooltipContent>Marcar como concluído</TooltipContent>
        </Tooltip>
      ) : null}

      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label="Editar prazo"
        onClick={() => setEditOpen(true)}
      >
        <Pencil className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label="Excluir prazo"
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2 className="text-destructive size-4" />
      </Button>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar prazo</DialogTitle>
          </DialogHeader>
          <DeadlineForm
            deadline={deadline}
            processes={processes}
            members={members}
            onSuccess={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir prazo?</AlertDialogTitle>
            <AlertDialogDescription>
              O prazo &quot;{deadline.type}&quot; deixará de aparecer nas listagens e no
              dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="size-4 animate-spin" /> : null}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
