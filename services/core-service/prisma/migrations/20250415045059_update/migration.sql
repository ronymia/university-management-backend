/*
  Warnings:

  - The primary key for the `course_faculties` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `FacultyId` on the `course_faculties` table. All the data in the column will be lost.
  - Added the required column `facultyId` to the `course_faculties` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "course_faculties" DROP CONSTRAINT "course_faculties_FacultyId_fkey";

-- AlterTable
ALTER TABLE "course_faculties" DROP CONSTRAINT "course_faculties_pkey",
DROP COLUMN "FacultyId",
ADD COLUMN     "facultyId" TEXT NOT NULL,
ADD CONSTRAINT "course_faculties_pkey" PRIMARY KEY ("courseId", "facultyId");

-- AddForeignKey
ALTER TABLE "course_faculties" ADD CONSTRAINT "course_faculties_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
