
import { format } from "date-fns";
import { formatInTimeZone } from 'date-fns-tz';

export const formatDateTime = (timestamp: string | Date, includeTimezone = true) => {
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Format as YYYY-MM-DD hh:mm:ss aa (12-hour format with AM/PM)
    const formattedDate = formatInTimeZone(
      date,
      userTimeZone,
      "yyyy-MM-dd hh:mm:ss aa"
    );

    if (!includeTimezone) {
      return formattedDate;
    }

    // Add timezone abbreviation
    const timeZoneAbbr = new Intl.DateTimeFormat('en', {
      timeZoneName: 'short',
      timeZone: userTimeZone
    }).formatToParts(date).find(part => part.type === 'timeZoneName')?.value || '';

    return `${formattedDate} ${timeZoneAbbr}`;
  } catch (error) {
    console.error("Date parsing error:", error);
    return typeof timestamp === 'string' ? timestamp : 'Invalid Date';
  }
};
