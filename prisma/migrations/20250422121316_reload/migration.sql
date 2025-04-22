/*
  Warnings:

  - You are about to drop the `StudentSemesterRegistration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentSemesterRegistration" DROP CONSTRAINT "StudentSemesterRegistration_semesterRegistrationId_fkey";

-- DropForeignKey
ALTER TABLE "StudentSemesterRegistration" DROP CONSTRAINT "StudentSemesterRegistration_studentId_fkey";

-- DropTable
DROP TABLE "StudentSemesterRegistration";

-- CreateTable
CREATE TABLE "student_semester_registrations" (
    "id" TEXT NOT NULL,
    "isConfirm" BOOLEAN DEFAULT false,
    "totalCreditsTaken" INTEGER DEFAULT 0,
    "studentId" TEXT NOT NULL,
    "semesterRegistrationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_semester_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_semester_registrations_studentId_semesterRegistrati_key" ON "student_semester_registrations"("studentId", "semesterRegistrationId");

-- AddForeignKey
ALTER TABLE "student_semester_registrations" ADD CONSTRAINT "student_semester_registrations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_semester_registrations" ADD CONSTRAINT "student_semester_registrations_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "semester_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
