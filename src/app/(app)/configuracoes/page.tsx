import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser } from "@/modules/auth/queries"
import { ProfileForm } from "@/modules/auth/components/profile-form"
import { ChangePasswordForm } from "@/modules/auth/components/change-password-form"
import { OabForm } from "@/modules/djen/components/oab-form"

export const metadata: Metadata = { title: "Configurações" }

export default async function SettingsPage() {
  const user = await getCurrentUser()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>

      <Tabs defaultValue="perfil">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="senha">Senha</TabsTrigger>
        </TabsList>
        <TabsContent value="perfil" className="space-y-6 pt-6">
          <ProfileForm name={user.name} email={user.email} />
          <OabForm oabNumber={user.oabNumber ?? ""} oabUf={user.oabUf ?? ""} />
        </TabsContent>
        <TabsContent value="senha" className="pt-6">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
