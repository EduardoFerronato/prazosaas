import { LogOut } from "lucide-react"
import { auth, signOut } from "@/lib/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
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
  const session = await auth()
  const user = session?.user

  return (
    <header className="flex h-14 shrink-0 items-center justify-end border-b px-6">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" className="h-9 gap-2 px-2" />}>
          <Avatar className="size-7">
            <AvatarFallback className="text-xs">
              {user?.name ? initials(user.name) : "?"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{user?.name}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
            {user?.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <DropdownMenuItem render={<button type="submit" className="w-full" />}>
              <LogOut className="size-4" />
              Sair
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
