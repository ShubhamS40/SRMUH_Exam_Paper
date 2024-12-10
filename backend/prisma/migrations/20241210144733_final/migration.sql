/*
  Warnings:

  - A unique constraint covering the columns `[subjectId,specializationId,examType,year]` on the table `Paper` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Paper" ADD COLUMN     "examType" TEXT NOT NULL DEFAULT 'Default Exam Type',
ADD COLUMN     "specializationId" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Paper_subjectId_specializationId_examType_year_key" ON "Paper"("subjectId", "specializationId", "examType", "year");

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
