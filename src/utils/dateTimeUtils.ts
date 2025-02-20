
import { format } from "date-fns";
import { formatInTimeZone } from 'date-fns-tz';

export const formatDateTime = (timestamp: string | Date, includeTimezone = true) => {
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const utcTime = formatInTimeZone(date, 'UTC', "MMM d, yyyy, HH:mm:ss 'UTC'");
    
    if (!includeTimezone) {
      return formatInTimeZone(date, userTimeZone, "MMM d, yyyy, hh:mm:ss aa");
    }

    const localTime = formatInTimeZone(
      date, 
      userTimeZone,
      `MMM d, yyyy, hh:mm:ss aa (${userTimeZone})`
    );

    return {
      utc: utcTime,
      local: localTime,
    };
  } catch (error) {
    console.error("Date parsing error:", error);
    return typeof timestamp === 'string' ? timestamp : 'Invalid Date';
  }
};
