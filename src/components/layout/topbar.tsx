import Link from "next/link"
import { Settings, LogOut } from "lucide-react"
import { signOut } from "@/lib/auth"
import { getCurrentUser } from "@/modules/auth/queries"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export async function Topbar() {
  const user = await getCurrentUser()

  return (
    <header className="flex h-16 shrink-0 items-center justify-end border-b px-6">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" className="h-10 gap-2.5 px-2" />}>
          <Avatar className="size-8">
            <AvatarFallback className="bg-blue-100 text-sm font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-[15px] font-medium">{user.name}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
              {user.email}
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/configuracoes" />}>
            <Settings className="size-4" />
            Perfil e configurações
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <DropdownMenuItem nativeButton render={<button type="submit" className="w-full" />}>
              <LogOut className="size-4" />
              Sair
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
