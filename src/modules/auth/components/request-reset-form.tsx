"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { CheckCircle2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { requestPasswordResetAction } from "@/modules/auth/actions"
import {
  requestPasswordResetSchema,
  type RequestPasswordResetInput,
} from "@/modules/auth/schemas"

export function RequestResetForm() {
  const [isPending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)

  const form = useForm<RequestPasswordResetInput>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: { email: "" },
  })

  function onSubmit(values: RequestPasswordResetInput) {
    startTransition(async () => {
      await requestPasswordResetAction(values)
      setSent(true)
    })
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="space-y-4"
      >
        <CheckCircle2 className="text-primary size-8" />
        <h1 className="text-2xl font-semibold tracking-tight">Verifique seu e-mail</h1>
        <p className="text-muted-foreground text-sm">
          Se existir uma conta com esse e-mail, enviamos um link para redefinir a senha.
          O link expira em 1 hora.
        </p>
        <Link href="/login" className="text-foreground text-sm font-medium hover:underline">
          Voltar para o login
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Recuperar senha</h1>
        <p className="text-muted-foreground text-sm">
          Informe seu e-mail e enviaremos um link de redefinição.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="voce@escritorio.com.br" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Enviar link
          </Button>
        </form>
      </Form>

      <p className="text-muted-foreground text-center text-sm">
        <Link href="/login" className="text-foreground font-medium hover:underline">
          Voltar para o login
        </Link>
      </p>
    </motion.div>
  )
}
