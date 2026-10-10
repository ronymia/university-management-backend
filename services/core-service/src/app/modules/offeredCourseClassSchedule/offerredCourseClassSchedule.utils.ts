import { OfferedCourseClassSchedule } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { timeToDate } from '../../../shared/dateTime';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const checkAvailableRoom = async (payload: OfferedCourseClassSchedule) => {
  //  CHECK IF SLOT IS ALREADY BOOKED
  const alreadyBookedSlotsOnDay =
    await prisma.offeredCourseClassSchedule.findMany({
      where: {
        dayOfWeek: payload.dayOfWeek,
        roomId: payload.roomId,
      },
    });

  // CHECK IF SLOT IS ALREADY BOOKED
  const existingSchedules = alreadyBookedSlotsOnDay.map(schedule => ({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    dayOfWeek: schedule.dayOfWeek,
  }));

  // NEW SCHEDULE
  const newSchedule = {
    startTime: payload.startTime,
    endTime: payload.endTime,
    dayOfWeek: payload.dayOfWeek,
  };

  for (const schedule of existingSchedules) {
    const existingStartTime: Date = timeToDate(schedule.startTime) as Date;
    const existingEndTime = timeToDate(schedule.endTime) as Date;

    const newStartTime = timeToDate(newSchedule.startTime) as Date;
    const newEndTime = timeToDate(newSchedule.endTime) as Date;

    if (newStartTime <= existingEndTime && newEndTime >= existingStartTime) {
      throw new ApiError(
        httpStatus.CONFLICT,
        `Room  is already booked at ${schedule.dayOfWeek} from ${schedule.startTime} to ${schedule.endTime}`
      );
    }
  }
};
const checkAvailableFaculty = async (payload: OfferedCourseClassSchedule) => {
  //  CHECK IF SLOT IS ALREADY BOOKED
  const alreadyAssignedFacultyOnDay =
    await prisma.offeredCourseClassSchedule.findMany({
      where: {
        dayOfWeek: payload.dayOfWeek,
        facultyId: payload.facultyId,
      },
    });

  // CHECK IF SLOT IS ALREADY BOOKED
  const existingSchedules = alreadyAssignedFacultyOnDay.map(schedule => ({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    dayOfWeek: schedule.dayOfWeek,
  }));

  // NEW SCHEDULE
  const newSchedule = {
    startTime: payload.startTime,
    endTime: payload.endTime,
    dayOfWeek: payload.dayOfWeek,
  };

  for (const schedule of existingSchedules) {
    const existingStartTime: Date = timeToDate(schedule.startTime) as Date;
    const existingEndTime = timeToDate(schedule.endTime) as Date;

    const newStartTime = timeToDate(newSchedule.startTime) as Date;
    const newEndTime = timeToDate(newSchedule.endTime) as Date;

    if (newStartTime <= existingEndTime && newEndTime >= existingStartTime) {
      throw new ApiError(
        httpStatus.CONFLICT,
        `Faculty  is already assigned at ${schedule.dayOfWeek} from ${schedule.startTime} to ${schedule.endTime}`
      );
    }
  }
};

export const OfferedCourseClassScheduleUtils = {
  checkAvailableRoom,
  checkAvailableFaculty,
};
