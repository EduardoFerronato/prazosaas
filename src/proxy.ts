import { NextResponse, type NextRequest } from "next/server"
import { auth } from "@/lib/auth"

const AUTH_ROUTES = ["/login", "/cadastro", "/recuperar-senha"]
const PROTECTED_PREFIXES = ["/dashboard", "/processos", "/prazos", "/configuracoes"]

export async function proxy(request: NextRequest) {
  const session = await auth()
  const url = new URL(request.url)
  const isLoggedIn = !!session?.user
  const isAuthRoute = AUTH_ROUTES.some((route) => url.pathname.startsWith(route))
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", url)
    loginUrl.searchParams.set("callbackUrl", url.pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
