"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { registerAction } from "@/modules/auth/actions"
import { registerSchema, type RegisterInput } from "@/modules/auth/schemas"

export function RegisterForm() {
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { organizationName: "", name: "", email: "", password: "" },
  })

  function onSubmit(values: RegisterInput) {
    setFormError(null)
    startTransition(async () => {
      const result = await registerAction(values)
      if (!result.success) {
        setFormError(result.error)
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
        <p className="text-muted-foreground text-sm">
          Leva menos de um minuto. Sem cartão de crédito.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="organizationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Escritório</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome ou o nome do escritório" {...field} />
                </FormControl>
                <FormDescription>
                  Você poderá convidar outros advogados depois.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormDescription>
                  Mínimo 8 caracteres, com maiúscula, minúscula e número.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {formError ? (
            <p className="text-destructive text-sm" role="alert">
              {formError}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Criar conta
          </Button>
        </form>
      </Form>

      <p className="text-muted-foreground text-center text-sm">
        Já tem conta?{" "}
        <Link href="/login" className="text-foreground font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </motion.div>
  )
}
