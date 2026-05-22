/*
  Warnings:

  - You are about to drop the column `toothCode` on the `ClinicalNote` table. All the data in the column will be lost.
  - You are about to drop the column `hasAsthma` on the `MedicalHistory` table. All the data in the column will be lost.
  - You are about to drop the column `hasDiabetes` on the `MedicalHistory` table. All the data in the column will be lost.
  - You are about to drop the column `hasEpilepsy` on the `MedicalHistory` table. All the data in the column will be lost.
  - You are about to drop the column `hasHIV` on the `MedicalHistory` table. All the data in the column will be lost.
  - You are about to drop the column `hasHeartDisease` on the `MedicalHistory` table. All the data in the column will be lost.
  - You are about to drop the column `hasHypertension` on the `MedicalHistory` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `treatment` on the `QuoteItem` table. All the data in the column will be lost.
  - Added the required column `description` to the `QuoteItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClinicalNote" DROP CONSTRAINT "ClinicalNote_doctorId_fkey";

-- DropIndex
DROP INDEX "Patient_dni_key";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "clinicId" TEXT;

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "clinicId" TEXT;

-- AlterTable
ALTER TABLE "ClinicalNote" DROP COLUMN "toothCode",
ADD COLUMN     "amount" DOUBLE PRECISION,
ADD COLUMN     "clinicId" TEXT,
ADD COLUMN     "diagnosis" TEXT,
ADD COLUMN     "observations" TEXT,
ADD COLUMN     "toothNumber" TEXT,
ADD COLUMN     "treatment" TEXT,
ALTER COLUMN "doctorId" DROP NOT NULL,
ALTER COLUMN "procedure" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "InventoryItem" ADD COLUMN     "clinicId" TEXT;

-- AlterTable
ALTER TABLE "MedicalHistory" DROP COLUMN "hasAsthma",
DROP COLUMN "hasDiabetes",
DROP COLUMN "hasEpilepsy",
DROP COLUMN "hasHIV",
DROP COLUMN "hasHeartDisease",
DROP COLUMN "hasHypertension",
ADD COLUMN     "asthma" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "diabetes" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "epilepsy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "heartDisease" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hiv" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hypertension" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "clinicId" TEXT;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "paidAt",
ADD COLUMN     "clinicId" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Prescription" ADD COLUMN     "clinicId" TEXT;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "clinicId" TEXT;

-- AlterTable
ALTER TABLE "QuoteItem" DROP COLUMN "treatment",
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clinicId" TEXT,
ALTER COLUMN "role" SET DEFAULT 'ADMIN';

-- CreateTable
CREATE TABLE "Clinic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "logoUrl" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'starter',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_slug_key" ON "Clinic"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_email_key" ON "Clinic"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNote" ADD CONSTRAINT "ClinicalNote_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNote" ADD CONSTRAINT "ClinicalNote_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
