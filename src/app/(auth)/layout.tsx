import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex w-full flex-col justify-between px-6 py-10 sm:px-10 lg:w-[480px] lg:shrink-0">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium">
          <ShieldCheck className="size-5" />
          <span>Prazo Certo</span>
        </Link>

        <div className="mx-auto w-full max-w-sm py-16">{children}</div>

        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} Prazo Certo. Todos os direitos reservados.
        </p>
      </div>

      <div className="bg-muted relative hidden flex-1 items-center justify-center overflow-hidden lg:flex">
        <div className="from-primary/10 via-primary/5 absolute inset-0 bg-gradient-to-br to-transparent" />
        <div className="relative z-10 max-w-md space-y-4 px-10 text-center">
          <p className="text-2xl font-semibold tracking-tight text-balance">
            Você nunca mais vai perder um prazo processual.
          </p>
          <p className="text-muted-foreground text-sm text-balance">
            Cálculo automático, notificações redundantes e trilha de auditoria completa —
            construído para o padrão de cuidado que sua advocacia exige.
          </p>
        </div>
      </div>
    </div>
  )
}
