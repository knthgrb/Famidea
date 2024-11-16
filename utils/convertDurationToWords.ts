export const convertDurationToWords = (duration: string): string => {
  const [hours, minutes, seconds] = duration.split(":").map(Number);

  // Handle cases based on the values of hours and minutes
  let result = [];

  if (hours > 0) {
    result.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  }
  if (minutes > 0) {
    result.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  }

  return result.length > 0 ? result.join(" and ") : "0 minutes";
};
