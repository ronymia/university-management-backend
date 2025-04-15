/*
  Warnings:

  - You are about to drop the `CourseToPrerequisite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseToPrerequisite" DROP CONSTRAINT "CourseToPrerequisite_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseToPrerequisite" DROP CONSTRAINT "CourseToPrerequisite_preRequisiteId_fkey";

-- DropTable
DROP TABLE "CourseToPrerequisite";

-- CreateTable
CREATE TABLE "course_to_prerequisites" (
    "courseId" TEXT NOT NULL,
    "preRequisiteId" TEXT NOT NULL,

    CONSTRAINT "course_to_prerequisites_pkey" PRIMARY KEY ("courseId","preRequisiteId")
);

-- CreateTable
CREATE TABLE "course_faculties" (
    "courseId" TEXT NOT NULL,
    "FacultyId" TEXT NOT NULL,

    CONSTRAINT "course_faculties_pkey" PRIMARY KEY ("courseId","FacultyId")
);

-- AddForeignKey
ALTER TABLE "course_to_prerequisites" ADD CONSTRAINT "course_to_prerequisites_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_to_prerequisites" ADD CONSTRAINT "course_to_prerequisites_preRequisiteId_fkey" FOREIGN KEY ("preRequisiteId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
