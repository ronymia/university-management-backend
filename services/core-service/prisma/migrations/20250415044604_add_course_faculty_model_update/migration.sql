-- AddForeignKey
ALTER TABLE "course_faculties" ADD CONSTRAINT "course_faculties_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_faculties" ADD CONSTRAINT "course_faculties_FacultyId_fkey" FOREIGN KEY ("FacultyId") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
