import type { Metadata } from "next"
import { RequestResetForm } from "@/modules/auth/components/request-reset-form"

export const metadata: Metadata = { title: "Recuperar senha" }

export default function RequestResetPage() {
  return <RequestResetForm />
}
