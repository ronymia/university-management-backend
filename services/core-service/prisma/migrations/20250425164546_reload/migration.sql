/*
  Warnings:

  - You are about to drop the column `totalCreditAttempted` on the `student_academic_infos` table. All the data in the column will be lost.
  - You are about to drop the column `totalCreditEarned` on the `student_academic_infos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId]` on the table `student_academic_infos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "offered_course_sections" ALTER COLUMN "currentEnrolledStudent" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "student_academic_infos" DROP COLUMN "totalCreditAttempted",
DROP COLUMN "totalCreditEarned";

-- CreateIndex
CREATE UNIQUE INDEX "student_academic_infos_studentId_key" ON "student_academic_infos"("studentId");
