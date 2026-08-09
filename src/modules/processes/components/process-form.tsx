"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { createProcessAction, updateProcessAction } from "@/modules/processes/actions"
import { processSchema, type ProcessInput } from "@/modules/processes/schemas"
import type { ProcessListItem } from "@/modules/processes/queries"

const NO_RESPONSIBLE = "none"

interface ProcessFormProps {
  process?: ProcessListItem
  members: { id: string; name: string }[]
  onSuccess: () => void
}

export function ProcessForm({ process, members, onSuccess }: ProcessFormProps) {
  const isEdit = !!process
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<ProcessInput>({
    resolver: zodResolver(processSchema),
    defaultValues: {
      number: process?.number ?? "",
      client: process?.client ?? "",
      court: process?.court ?? "",
      county: process?.county ?? "",
      type: process?.type ?? "",
      responsibleId: process?.responsibleId ?? undefined,
      notes: process?.notes ?? "",
    },
  })

  function onSubmit(values: ProcessInput) {
    setFormError(null)
    startTransition(async () => {
      const result =
        isEdit && process
          ? await updateProcessAction({ ...values, id: process.id })
          : await createProcessAction(values)

      if (!result.success) {
        setFormError(result.error)
        return
      }

      toast.success(isEdit ? "Processo atualizado." : "Processo cadastrado.")
      form.reset()
      onSuccess()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Número do processo</FormLabel>
                <FormControl>
                  <Input placeholder="0001234-56.2026.8.26.0100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Cliente</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="court"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tribunal</FormLabel>
                <FormControl>
                  <Input placeholder="TJSP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
              <FormItem className="col-span-2">
                <FormLabel>Tipo de ação</FormLabel>
                <FormControl>
                  <Input placeholder="Ação de Cobrança" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responsibleId"
            render={({ field }) => (
              <FormItem className="col-span-2">
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

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {formError ? (
          <p className="text-destructive text-sm" role="alert">
            {formError}
          </p>
        ) : null}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {isEdit ? "Salvar alterações" : "Cadastrar processo"}
        </Button>
      </form>
    </Form>
  )
}
