import {
  FilePlus,
  FileEdit,
  FileX,
  CalendarPlus,
  CalendarCheck,
  CalendarX,
  UserPlus,
  type LucideIcon,
} from "lucide-react"

import type { RecentEvent } from "@/modules/events/queries"

interface EventDescription {
  icon: LucideIcon
  text: string
}

export function describeEvent(event: RecentEvent): EventDescription {
  const actor = event.actor?.name ?? "Sistema"
  const processLabel = event.process?.number ? `processo ${event.process.number}` : "um processo"
  const deadlineLabel = event.deadline?.type ? `"${event.deadline.type}"` : "um prazo"

  switch (event.type) {
    case "PROCESS_CREATED":
      return { icon: FilePlus, text: `${actor} cadastrou o ${processLabel}` }
    case "PROCESS_UPDATED":
      return { icon: FileEdit, text: `${actor} atualizou o ${processLabel}` }
    case "PROCESS_ARCHIVED":
      return { icon: FileX, text: `${actor} arquivou o ${processLabel}` }
    case "PROCESS_DELETED":
      return { icon: FileX, text: `${actor} excluiu o ${processLabel}` }
    case "DEADLINE_CREATED":
      return { icon: CalendarPlus, text: `${actor} cadastrou o prazo ${deadlineLabel}` }
    case "DEADLINE_UPDATED":
      return { icon: FileEdit, text: `${actor} atualizou o prazo ${deadlineLabel}` }
    case "DEADLINE_COMPLETED":
      return { icon: CalendarCheck, text: `${actor} concluiu o prazo ${deadlineLabel}` }
    case "DEADLINE_MISSED":
      return { icon: CalendarX, text: `O prazo ${deadlineLabel} venceu sem conclusão` }
    case "DEADLINE_CANCELED":
      return { icon: CalendarX, text: `${actor} cancelou o prazo ${deadlineLabel}` }
    case "DEADLINE_DELETED":
      return { icon: CalendarX, text: `${actor} excluiu o prazo ${deadlineLabel}` }
    case "MEMBER_JOINED":
      return { icon: UserPlus, text: `${actor} entrou na organização` }
    case "MEMBER_INVITED":
      return { icon: UserPlus, text: `${actor} convidou um novo membro` }
    case "MEMBER_ROLE_CHANGED":
      return { icon: UserPlus, text: `${actor} teve o papel alterado` }
    case "MEMBER_REMOVED":
      return { icon: UserPlus, text: `${actor} foi removido da organização` }
    default:
      return { icon: FileEdit, text: `${actor} fez uma alteração` }
  }
}
