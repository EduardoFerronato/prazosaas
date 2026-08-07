import "server-only"

type EmailPayload = {
  to: string
  subject: string
  body: string
}

/**
 * TODO: plugar um provedor real (Resend, SES, Postmark...) antes de ir para produção.
 * Por ora, apenas loga em dev para não bloquear o restante do fluxo de auth/notificações.
 */
export async function sendEmail({ to, subject, body }: EmailPayload) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[email:dev] para=${to} assunto="${subject}"\n${body}`)
    return { delivered: true as const }
  }

  throw new Error("Provedor de e-mail não configurado")
}
