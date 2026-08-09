import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("Informe um e-mail válido"),
  password: z.string().min(1, "Informe sua senha"),
})

export const registerSchema = z.object({
  organizationName: z.string().trim().min(2, "Informe o nome do escritório ou o seu nome"),
  name: z.string().trim().min(2, "Informe seu nome completo"),
  email: z.email("Informe um e-mail válido"),
  password: z
    .string()
    .min(8, "A senha precisa ter no mínimo 8 caracteres")
    .regex(/[a-z]/, "A senha precisa ter ao menos uma letra minúscula")
    .regex(/[A-Z]/, "A senha precisa ter ao menos uma letra maiúscula")
    .regex(/[0-9]/, "A senha precisa ter ao menos um número"),
})

export const requestPasswordResetSchema = z.object({
  email: z.email("Informe um e-mail válido"),
})

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z
      .string()
      .min(8, "A senha precisa ter no mínimo 8 caracteres")
      .regex(/[a-z]/, "A senha precisa ter ao menos uma letra minúscula")
      .regex(/[A-Z]/, "A senha precisa ter ao menos uma letra maiúscula")
      .regex(/[0-9]/, "A senha precisa ter ao menos um número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo"),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe sua senha atual"),
    newPassword: z
      .string()
      .min(8, "A senha precisa ter no mínimo 8 caracteres")
      .regex(/[a-z]/, "A senha precisa ter ao menos uma letra minúscula")
      .regex(/[A-Z]/, "A senha precisa ter ao menos uma letra maiúscula")
      .regex(/[0-9]/, "A senha precisa ter ao menos um número"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem",
    path: ["confirmNewPassword"],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
