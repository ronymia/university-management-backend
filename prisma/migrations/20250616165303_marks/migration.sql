/*
  Warnings:

  - You are about to drop the column `mark` on the `student_enrolled_course_marks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "middleName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "faculties" ALTER COLUMN "middleName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "student_enrolled_course_marks" DROP COLUMN "mark",
ADD COLUMN     "marks" INTEGER DEFAULT 0;
