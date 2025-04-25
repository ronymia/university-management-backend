-- CreateTable
CREATE TABLE "student_academic_infos" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "cgpa" DOUBLE PRECISION DEFAULT 0,
    "totalCreditEarned" INTEGER DEFAULT 0,
    "totalCreditAttempted" INTEGER DEFAULT 0,
    "totalCreditCompleted" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_academic_infos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "student_academic_infos" ADD CONSTRAINT "student_academic_infos_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
