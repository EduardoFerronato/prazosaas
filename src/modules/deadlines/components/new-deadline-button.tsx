"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DeadlineForm } from "@/modules/deadlines/components/deadline-form"
import type { ProcessOption } from "@/modules/processes/queries"

export function NewDeadlineButton({
  processes,
  members,
  defaultProcessId,
}: {
  processes: ProcessOption[]
  members: { id: string; name: string }[]
  defaultProcessId?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)} disabled={processes.length === 0}>
        <Plus className="size-4" />
        Novo prazo
      </Button>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo prazo</DialogTitle>
        </DialogHeader>
        <DeadlineForm
          processes={processes}
          members={members}
          defaultProcessId={defaultProcessId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
