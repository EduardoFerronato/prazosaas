"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { importDjenItemAction } from "@/modules/djen/actions"
import { importDjenItemSchema, type ImportDjenItemInput } from "@/modules/djen/schemas"
import type { DjenImportListItem } from "@/modules/djen/queries"

const NO_RESPONSIBLE = "none"

export function ImportDjenItemDialog({
  item,
  members,
  open,
  onOpenChange,
}: {
  item: DjenImportListItem
  members: { id: string; name: string }[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<ImportDjenItemInput>({
    resolver: zodResolver(importDjenItemSchema),
    defaultValues: {
      id: item.id,
      client: "",
      county: "",
      type: item.tipoComunicacao,
      responsibleId: undefined,
    },
  })

  function onSubmit(values: ImportDjenItemInput) {
    setFormError(null)
    startTransition(async () => {
      const result = await importDjenItemAction(values)
      if (!result.success) {
        setFormError(result.error)
        return
      }
      toast.success("Processo criado a partir do DJEN.")
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Importar como processo</DialogTitle>
        </DialogHeader>

        <div className="bg-muted rounded-lg p-3 text-sm">
          <p className="font-mono">{item.numeroProcesso}</p>
          <p className="text-muted-foreground text-xs">
            {item.tribunal} · {item.orgao}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="county"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comarca</FormLabel>
                    <FormControl>
                      <Input placeholder="São Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de ação</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="responsibleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <Select
                    value={field.value ?? NO_RESPONSIBLE}
                    onValueChange={(value) =>
                      field.onChange(value === NO_RESPONSIBLE ? undefined : value)
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sem responsável" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NO_RESPONSIBLE}>Sem responsável</SelectItem>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {formError ? (
              <p className="text-destructive text-sm" role="alert">
                {formError}
              </p>
            ) : null}

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Criar processo
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
