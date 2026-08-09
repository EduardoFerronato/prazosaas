"use server"

import { randomBytes, createHash } from "node:crypto"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

import type { Prisma } from "@/generated/prisma/client"
import { CredentialsSignin } from "next-auth"
import { db } from "@/lib/db"
import { signIn } from "@/lib/auth"
import { requireSession } from "@/lib/session"
import type { ActionResult } from "@/lib/action-result"
import { sendEmail } from "@/modules/notifications/send"
import {
  loginSchema,
  registerSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
  type LoginInput,
  type RegisterInput,
  type RequestPasswordResetInput,
  type ResetPasswordInput,
  type UpdateProfileInput,
  type ChangePasswordInput,
} from "@/modules/auth/schemas"

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hora
const BCRYPT_COST = 12

export async function registerAction(input: RegisterInput): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }
  const { organizationName, name, email, password } = parsed.data

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return { success: false, error: "Já existe uma conta com este e-mail" }
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST)

  await db.$transaction(async (tx: Prisma.TransactionClient) => {
    const organization = await tx.organization.create({
      data: { name: organizationName },
    })

    const user = await tx.user.create({
      data: { name, email, passwordHash },
    })

    await tx.membership.create({
      data: { organizationId: organization.id, userId: user.id, role: "ADMIN" },
    })

    await tx.event.create({
      data: {
        organizationId: organization.id,
        actorId: user.id,
        type: "MEMBER_JOINED",
        metadata: { name, email },
      },
    })
  })

  await signIn("credentials", { email, password, redirectTo: "/dashboard" })

  return { success: true, data: undefined }
}

export async function loginAction(input: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    })
  } catch (err) {
    if (err instanceof CredentialsSignin) {
      return { success: false, error: "E-mail ou senha incorretos" }
    }
    throw err
  }

  return { success: true, data: undefined }
}

export async function requestPasswordResetAction(
  input: RequestPasswordResetInput
): Promise<ActionResult> {
  const parsed = requestPasswordResetSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email, deletedAt: null } })

  // Nunca revela se o e-mail existe ou não (evita enumeração de contas)
  if (user) {
    const rawToken = randomBytes(32).toString("hex")
    const tokenHash = createHash("sha256").update(rawToken).digest("hex")

    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/recuperar-senha/${rawToken}`
    await sendEmail({
      to: user.email,
      subject: "Redefinição de senha",
      body: `Clique no link para redefinir sua senha (válido por 1 hora): ${resetUrl}`,
    })
  }

  return { success: true, data: undefined }
}

export async function resetPasswordAction(input: ResetPasswordInput): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  const tokenHash = createHash("sha256").update(parsed.data.token).digest("hex")
  const resetToken = await db.passwordResetToken.findUnique({ where: { tokenHash } })

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return { success: false, error: "Link inválido ou expirado. Solicite uma nova redefinição." }
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, BCRYPT_COST)

  await db.$transaction([
    db.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    db.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
  ])

  return { success: true, data: undefined }
}

export async function updateProfileAction(input: UpdateProfileInput): Promise<ActionResult> {
  const session = await requireSession()
  const parsed = updateProfileSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
  })

  revalidatePath("/", "layout")

  return { success: true, data: undefined }
}

export async function changePasswordAction(input: ChangePasswordInput): Promise<ActionResult> {
  const session = await requireSession()
  const parsed = changePasswordSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  const user = await db.user.findUniqueOrThrow({ where: { id: session.user.id } })
  const currentPasswordMatches = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash)
  if (!currentPasswordMatches) {
    return { success: false, error: "Senha atual incorreta" }
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, BCRYPT_COST)
  await db.user.update({ where: { id: session.user.id }, data: { passwordHash } })

  return { success: true, data: undefined }
}
