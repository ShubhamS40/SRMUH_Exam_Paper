/*
  Warnings:

  - You are about to drop the column `registration_no` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "registration_no";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
