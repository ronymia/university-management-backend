import { PrismaClient } from '@prisma/client';

const createSemesterPayment = async (
  prismaClient: Parameters<Parameters<PrismaClient['$transaction']>[0]>[0],
  payload: {
    studentId: string;
    academicSemesterId: string;
    totalPaymentAmount: number;
  }
) => {
  const getSemesterPayment =
    await prismaClient.studentSemesterPayment.findFirst({
      where: {
        studentId: payload.studentId,
        academicSemesterId: payload.academicSemesterId,
      },
    });

  if (!getSemesterPayment) {
    const paymentData = {
      studentId: payload.studentId,
      academicSemesterId: payload.academicSemesterId,
      fullPaymentAmount: payload.totalPaymentAmount,
      partialPaymentAmount: 0,
      totalDuePaymentAmount: payload.totalPaymentAmount,
      totalPaidPaymentAmount: 0,
    };

    await prismaClient.studentSemesterPayment.create({
      data: paymentData,
    });
  }
};

// EXPORT
export const StudentSemesterPaymentService = {
  createSemesterPayment,
};
