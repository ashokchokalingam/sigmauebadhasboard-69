
import { format } from "date-fns";
import { formatInTimeZone } from 'date-fns-tz';

export const formatDateTime = (timestamp: string | Date, includeTimezone = true) => {
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Format as YYYY-MM-DD HH:mm:ss with timezone
    const formattedDate = formatInTimeZone(
      date,
      userTimeZone,
      "yyyy-MM-dd HH:mm:ss"
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
