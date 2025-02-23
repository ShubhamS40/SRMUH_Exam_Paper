-- CreateEnum
CREATE TYPE "BtechSpecializationType" AS ENUM ('CORE', 'AIML', 'DEVOPS');

-- CreateEnum
CREATE TYPE "LawSpecializationType" AS ENUM ('BA_LLB', 'BBA_LLB', 'LLB');

-- CreateEnum
CREATE TYPE "BtechYearType" AS ENUM ('YEAR_2023', 'YEAR_2024', 'YEAR_2025');

-- CreateEnum
CREATE TYPE "LawYearType" AS ENUM ('YEAR_2023', 'YEAR_2024', 'YEAR_2025');

-- CreateEnum
CREATE TYPE "BtechSemesterType" AS ENUM ('SEM_1', 'SEM_2', 'SEM_3', 'SEM_4', 'SEM_5', 'SEM_6', 'SEM_7', 'SEM_8');

-- CreateEnum
CREATE TYPE "LawSemesterType" AS ENUM ('SEM_1', 'SEM_2', 'SEM_3', 'SEM_4', 'SEM_5', 'SEM_6', 'SEM_7', 'SEM_8', 'SEM_9', 'SEM_10');

-- CreateEnum
CREATE TYPE "BcaSpecializationType" AS ENUM ('CORE');

-- CreateEnum
CREATE TYPE "BcaYearType" AS ENUM ('YEAR_2023', 'YEAR_2024', 'YEAR_2025');

-- CreateEnum
CREATE TYPE "BcaSemesterType" AS ENUM ('SEM_1', 'SEM_2', 'SEM_3', 'SEM_4', 'SEM_5', 'SEM_6');

-- CreateEnum
CREATE TYPE "BcomSpecializationType" AS ENUM ('HONS', 'CORE');

-- CreateEnum
CREATE TYPE "BcomYearType" AS ENUM ('YEAR_2023', 'YEAR_2024', 'YEAR_2025');

-- CreateEnum
CREATE TYPE "BcomSemesterType" AS ENUM ('SEM_1', 'SEM_2', 'SEM_3', 'SEM_4', 'SEM_5', 'SEM_6');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('END_TERM', 'MAST_1', 'MAST_2');

-- CreateTable
CREATE TABLE "Btech" (
    "id" TEXT NOT NULL,
    "specialization" "BtechSpecializationType" NOT NULL,
    "subject" TEXT NOT NULL,
    "year" "BtechYearType" NOT NULL,
    "semester" "BtechSemesterType" NOT NULL,
    "examType" "ExamType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Btech_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Law" (
    "id" TEXT NOT NULL,
    "specialization" "LawSpecializationType" NOT NULL,
    "subject" TEXT NOT NULL,
    "year" "LawYearType" NOT NULL,
    "semester" "LawSemesterType" NOT NULL,
    "examType" "ExamType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Law_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bca" (
    "id" TEXT NOT NULL,
    "specialization" "BcaSpecializationType" NOT NULL,
    "subject" TEXT NOT NULL,
    "year" "BcaYearType" NOT NULL,
    "semester" "BcaSemesterType" NOT NULL,
    "examType" "ExamType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bcom" (
    "id" TEXT NOT NULL,
    "specialization" "BcomSpecializationType" NOT NULL,
    "subject" TEXT NOT NULL,
    "year" "BcomYearType" NOT NULL,
    "semester" "BcomSemesterType" NOT NULL,
    "examType" "ExamType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bcom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_registrationNo_key" ON "User"("registrationNo");
