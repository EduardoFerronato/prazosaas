"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { updateProfileAction } from "@/modules/auth/actions"
import { updateProfileSchema, type UpdateProfileInput } from "@/modules/auth/schemas"

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name },
  })

  function onSubmit(values: UpdateProfileInput) {
    setFormError(null)
    startTransition(async () => {
      const result = await updateProfileAction(values)
      if (!result.success) {
        setFormError(result.error)
        return
      }
      toast.success("Perfil atualizado.")
    })
  }

  return (
    <div className="max-w-sm space-y-6">
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs">E-mail</Label>
        <p className="text-sm">{email}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {formError ? (
            <p className="text-destructive text-sm" role="alert">
              {formError}
            </p>
          ) : null}

          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Salvar alterações
          </Button>
        </form>
      </Form>
    </div>
  )
}
