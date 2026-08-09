import "dotenv/config"
import { PrismaNeon } from "@prisma/adapter-neon"
import ws from "ws"
import { neonConfig } from "@neondatabase/serverless"
import { PrismaClient } from "../src/generated/prisma/client"

neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const db = new PrismaClient({ adapter })

function daysFromNow(n: number) {
  return new Date(Date.now() + n * 24 * 60 * 60 * 1000)
}

async function seedOrganization(organizationId: string, responsibleId: string | undefined) {
  const processo1 = await db.process.create({
    data: {
      organizationId,
      number: "0001234-56.2026.8.26.0100",
      client: "João da Silva",
      court: "TJSP",
      county: "São Paulo",
      type: "Ação de Cobrança",
      responsibleId,
      notes: "Processo de exemplo gerado pelo seed.",
    },
  })

  const processo2 = await db.process.create({
    data: {
      organizationId,
      number: "0007890-12.2025.8.26.0100",
      client: "Maria Oliveira",
      court: "TRT-2",
      county: "São Paulo",
      type: "Reclamação Trabalhista",
      responsibleId,
    },
  })

  await db.deadline.createMany({
    data: [
      {
        organizationId,
        processId: processo1.id,
        responsibleId,
        type: "Contestação",
        legalBasis: "Art. 335, CPC",
        intimationDate: daysFromNow(-10),
        days: 15,
        dueDate: daysFromNow(3),
        calculationConfidence: "CERTIFIED",
        status: "PENDING",
      },
      {
        organizationId,
        processId: processo1.id,
        responsibleId,
        type: "Réplica",
        legalBasis: "Art. 350, CPC",
        intimationDate: daysFromNow(-2),
        days: 15,
        dueDate: daysFromNow(13),
        calculationConfidence: "CERTIFIED",
        status: "PENDING",
      },
      {
        organizationId,
        processId: processo2.id,
        responsibleId,
        type: "Recurso Ordinário",
        legalBasis: "Art. 895, CLT",
        intimationDate: daysFromNow(-20),
        days: 8,
        dueDate: daysFromNow(-5),
        calculationConfidence: "MANUAL",
        status: "MISSED",
      },
      {
        organizationId,
        processId: processo2.id,
        responsibleId,
        type: "Manifestação sobre laudo pericial",
        intimationDate: daysFromNow(-30),
        days: 10,
        dueDate: daysFromNow(-15),
        calculationConfidence: "CERTIFIED",
        status: "COMPLETED",
        completedAt: daysFromNow(-16),
      },
    ],
  })
}

async function main() {
  // Roda para toda organização que ainda não tem nenhum processo (evita duplicar
  // dados em quem já está usando o produto de verdade).
  const organizations = await db.organization.findMany({
    where: { deletedAt: null, processes: { none: {} } },
    include: {
      memberships: { orderBy: { createdAt: "asc" }, take: 1 },
    },
  })

  if (!organizations.length) {
    console.log("Nenhuma organização sem dados encontrada. Nada para semear.")
    return
  }

  for (const organization of organizations) {
    const responsibleId = organization.memberships[0]?.userId
    console.log(`Semeando dados de exemplo para "${organization.name}"...`)
    await seedOrganization(organization.id, responsibleId)
  }

  console.log(`Seed concluído para ${organizations.length} organização(ões).`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
