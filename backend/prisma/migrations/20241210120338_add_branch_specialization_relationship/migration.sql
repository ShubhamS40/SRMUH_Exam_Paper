/*
  Warnings:

  - You are about to drop the column `branchId` on the `Specialization` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Specialization" DROP CONSTRAINT "Specialization_branchId_fkey";

-- AlterTable
ALTER TABLE "Specialization" DROP COLUMN "branchId";

-- CreateTable
CREATE TABLE "BranchSpecialization" (
    "branchId" INTEGER NOT NULL,
    "specializationId" INTEGER NOT NULL,

    CONSTRAINT "BranchSpecialization_pkey" PRIMARY KEY ("branchId","specializationId")
);

-- AddForeignKey
ALTER TABLE "BranchSpecialization" ADD CONSTRAINT "BranchSpecialization_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchSpecialization" ADD CONSTRAINT "BranchSpecialization_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
