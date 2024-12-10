-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "registration_no" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upload_By_User" (
    "id" SERIAL NOT NULL,
    "academic_year" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "specilization" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "exam_type" TEXT NOT NULL,
    "fileurl" TEXT NOT NULL,

    CONSTRAINT "Upload_By_User_pkey" PRIMARY KEY ("id")
);
