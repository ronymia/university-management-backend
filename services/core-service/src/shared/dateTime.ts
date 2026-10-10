import { isValidTime } from './regex';

// convert time to date
export function timeToDate(time: string): Date | null {
  if (!isValidTime(time)) return null;
  return new Date(`1970-01-01T${time}:00`);
}

// check if end time is after start time
export function isEndTimeAfterStartTime({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}): boolean {
  const start = timeToDate(startTime);
  const end = timeToDate(endTime);

  if (!start || !end) return false; // Invalid input
  return end > start;
}
export function isStartTimeBeforeEndTime({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}): boolean {
  const start = timeToDate(startTime);
  const end = timeToDate(endTime);

  if (!start || !end) return false; // Invalid input
  return end >= start;
}
