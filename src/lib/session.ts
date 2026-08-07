import "server-only"
import { auth } from "@/lib/auth"

export class UnauthorizedError extends Error {
  constructor() {
    super("Não autenticado")
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("Sem permissão para executar esta ação")
    this.name = "ForbiddenError"
  }
}

/** Barreira real de autenticação: chamar no início de todo Server Action/query. */
export async function requireSession() {
  const session = await auth()
  if (!session?.user) throw new UnauthorizedError()
  return session
}

/** Barreira real de autorização: exige papel de Admin na organização atual. */
export async function requireAdmin() {
  const session = await requireSession()
  if (session.user.role !== "ADMIN") throw new ForbiddenError()
  return session
}
