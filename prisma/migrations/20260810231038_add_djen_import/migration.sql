-- CreateEnum
CREATE TYPE "DjenImportStatus" AS ENUM ('PENDING', 'IMPORTED', 'DISMISSED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "djenLastSyncAt" TIMESTAMP(3),
ADD COLUMN     "oabNumber" TEXT,
ADD COLUMN     "oabUf" TEXT;

-- CreateTable
CREATE TABLE "djen_imports" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "processId" UUID,
    "djenHash" TEXT NOT NULL,
    "numeroProcesso" TEXT NOT NULL,
    "tribunal" TEXT NOT NULL,
    "orgao" TEXT NOT NULL,
    "tipoComunicacao" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "dataDisponibilizacao" TIMESTAMP(3) NOT NULL,
    "link" TEXT,
    "status" "DjenImportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "djen_imports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "djen_imports_djenHash_key" ON "djen_imports"("djenHash");

-- CreateIndex
CREATE INDEX "djen_imports_organizationId_status_idx" ON "djen_imports"("organizationId", "status");

-- CreateIndex
CREATE INDEX "djen_imports_userId_idx" ON "djen_imports"("userId");

-- AddForeignKey
ALTER TABLE "djen_imports" ADD CONSTRAINT "djen_imports_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "djen_imports" ADD CONSTRAINT "djen_imports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "djen_imports" ADD CONSTRAINT "djen_imports_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
