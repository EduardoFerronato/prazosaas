"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
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
import { updateOabAction } from "@/modules/djen/actions"
import { oabSchema, BRAZILIAN_UFS, type OabInput } from "@/modules/djen/schemas"

export function OabForm({ oabNumber, oabUf }: { oabNumber: string; oabUf: string }) {
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<OabInput>({
    resolver: zodResolver(oabSchema),
    defaultValues: { oabNumber, oabUf: oabUf as OabInput["oabUf"] },
  })

  function onSubmit(values: OabInput) {
    setFormError(null)
    startTransition(async () => {
      const result = await updateOabAction(values)
      if (!result.success) {
        setFormError(result.error)
        return
      }
      toast.success("OAB salva.")
    })
  }

  return (
    <div className="max-w-sm space-y-4 border-t pt-6">
      <div>
        <h3 className="text-sm font-medium">Captura automática de processos</h3>
        <p className="text-muted-foreground text-sm">
          Cadastre sua OAB para buscar suas intimações direto do DJEN (Diário de Justiça
          Eletrônico Nacional).
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="oabNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da OAB</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="oabUf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UF</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BRAZILIAN_UFS.map((uf) => (
                        <SelectItem key={uf} value={uf}>
                          {uf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormDescription>
            A busca cobre comunicações públicas do DJEN. Cobertura ainda incompleta em alguns
            tribunais — não substitui o cadastro manual.
          </FormDescription>

          {formError ? (
            <p className="text-destructive text-sm" role="alert">
              {formError}
            </p>
          ) : null}

          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Salvar OAB
          </Button>
        </form>
      </Form>
    </div>
  )
}
