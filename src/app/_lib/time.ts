/**
 * Convert UTC Date to a ISO Date Time String in local timezone
 * @param date UTC Date
 * @returns ISO Date Time String in local timezone
 */
export function toISOStringOffset(date: Date) {
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - timezoneOffset);

  return localDate.toISOString().slice(0, -8); // remove ':00.000Z'
}

/**
 * Format Time in 12hr format
 * @param dateTime ISO Date Time String
 * @returns formated time string
 */
export function formatTime(dateTime: string) {
  if (dateTime === "") return "";
  const date = new Date(dateTime);
  const hours = date.getHours();
  const mins = date.getMinutes();
  return `${hours % 12 || 12}:${String(mins).padStart(2, "0")} ${
    hours >= 12 ? "PM" : "AM"
  }`;
}

/**
 * Format Date
 * @param dateTime ISO Date TIme String
 * @param expanded true = long format, false = short format
 * @returns formatted date string
 */
export function formatDate(dateTime: string, expanded = true) {
  const sameYear =
    toISOStringOffset(new Date()).slice(0, 4) != dateTime.slice(0, 4);
  return new Date(dateTime).toLocaleDateString("en-US", {
    weekday: expanded ? "long" : "short",
    month: expanded ? "long" : "short",
    day: "numeric",
    year: !sameYear ? (expanded ? "numeric" : undefined) : "numeric",
  });
}

/**
 * Add minutes to ISO Date Time String
 * Makes sure to properly handle overflow hours, days, months, years, etc...
 * @param dateTime ISO Date Time String
 * @param addMins minutes to add
 * @returns ISO Date Time String
 */
export function addMinutes(dateTime: string, addMins: number) {
  if (dateTime === "") return "";
  const date = new Date(dateTime);
  date.setMinutes(date.getMinutes() + addMins);
  return toISOStringOffset(date);
}

/**
 * Finds difference in minutes between two ISO Date Time Strings
 * @param larger Date Time String 1, ensure this one is larger if you want positive output
 * @param smaller Date Time String 2, ensure this one is smaller if you want positive output
 * @returns difference in minutes
 */
export function subTime(larger: string, smaller: string) {
  if (larger === "") return 0;
  if (smaller === "") return 0;

  const largerDate = new Date(larger).getTime();
  const smallerDate = new Date(smaller).getTime();
  const ms = largerDate - smallerDate;
  return Math.round(ms / 1000 / 60);
}

/**
 * Format duration
 * @param mins duration in minutes
 * @returns formatted duration string
 */
export function formatDuration(mins: number) {
  if (!mins) mins = 0;

  const negative = mins < 0;
  mins = Math.abs(mins);

  const hours = Math.floor(mins / 60);
  mins %= 60;
  return `${negative ? "-" : ""}${hours}H ${mins}M`;

  // if (hours > 0) return `${hours}H ${mins}M`;
  // else return `${mins}M`;
}

/**
 * Check if date is between two other dates
 *
 * Use undefined if you don't want to check one of the bounds.
 *
 * Usage:
 * ```js
 *
 * let todayIsoStr = ...;
 *
 * isDateBetween("2024-10-01T12:00", todayIsoStr, undefined)
 * // returns true if todayIsoStr is after October 1st, 2024 12:00PM
 *
 * isDateBetween(undefined, todayIsoStr, "2024-10-01T12:00")
 * // returns true if todayIsoStr is before October 1st, 2024 12:00PM
 *
 * isDateBetween("2024-10-01T12:00", todayIsoStr, "2024-11-01T12:00")
 * // returns true if todayIsoStr is between October 1st, 2024 12:00PM and November 1st, 2024 12:00PM
 * ```
 *
 * @param startDate Starting ISO Date Time String or undefined
 * @param date Checking ISO Date Time String
 * @param endDate Ending ISO Date Time String or undefined
 * @returns true if between, false if not
 */
export function isDateBetween(
  startDate: string | undefined,
  date: string,
  endDate: string | undefined
): boolean {
  const start = startDate ? new Date(startDate) : undefined;
  const end = endDate ? new Date(endDate) : endDate;

  const currentDate = new Date(date);

  if (start && end) return currentDate > start && currentDate < end;
  if (start) return currentDate > start;
  if (end) return currentDate < end;
  return true;
}
