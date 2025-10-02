export function convertToSeconds(time: string): number {
  // Expecting format "HH:MM"
  const [hoursStr, minutesStr] = time.split(':');

  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error(`Invalid time format: ${time}`);
  }

  return hours * 3600 + minutes * 60;
}
