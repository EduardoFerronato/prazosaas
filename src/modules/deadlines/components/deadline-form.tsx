"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
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
import { createDeadlineAction, updateDeadlineAction } from "@/modules/deadlines/actions"
import { deadlineSchema, type DeadlineInput } from "@/modules/deadlines/schemas"
import type { DeadlineListItem } from "@/modules/deadlines/queries"
import type { ProcessOption } from "@/modules/processes/queries"

const NO_RESPONSIBLE = "none"

interface DeadlineFormProps {
  deadline?: DeadlineListItem
  processes: ProcessOption[]
  members: { id: string; name: string }[]
  defaultProcessId?: string
  onSuccess: () => void
}

export function DeadlineForm({
  deadline,
  processes,
  members,
  defaultProcessId,
  onSuccess,
}: DeadlineFormProps) {
  const isEdit = !!deadline
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<DeadlineInput>({
    resolver: zodResolver(deadlineSchema),
    defaultValues: {
      processId: deadline?.processId ?? defaultProcessId ?? "",
      type: deadline?.type ?? "",
      legalBasis: deadline?.legalBasis ?? "",
      intimationDate: deadline ? format(deadline.intimationDate, "yyyy-MM-dd") : "",
      days: deadline?.days ?? 15,
      responsibleId: deadline?.responsibleId ?? undefined,
      notes: deadline?.notes ?? "",
    },
  })

  function onSubmit(values: DeadlineInput) {
    setFormError(null)
    startTransition(async () => {
      const result =
        isEdit && deadline
          ? await updateDeadlineAction({ ...values, id: deadline.id })
          : await createDeadlineAction(values)

      if (!result.success) {
        setFormError(result.error)
        return
      }

      toast.success(isEdit ? "Prazo atualizado." : "Prazo cadastrado e calculado automaticamente.")
      form.reset()
      onSuccess()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="processId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Processo</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o processo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {processes.map((process) => (
                    <SelectItem key={process.id} value={process.id}>
                      {process.number} · {process.client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Tipo de prazo</FormLabel>
                <FormControl>
                  <Input placeholder="Contestação" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="legalBasis"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Fundamento legal (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Art. 335, CPC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="intimationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data da intimação</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dias (úteis)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={365}
                    name={field.name}
                    ref={field.ref}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
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

        <p className="text-muted-foreground text-xs">
          A data de vencimento é calculada automaticamente em dias úteis a partir da intimação.
        </p>

        {formError ? (
          <p className="text-destructive text-sm" role="alert">
            {formError}
          </p>
        ) : null}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {isEdit ? "Salvar alterações" : "Cadastrar prazo"}
        </Button>
      </form>
    </Form>
  )
}
