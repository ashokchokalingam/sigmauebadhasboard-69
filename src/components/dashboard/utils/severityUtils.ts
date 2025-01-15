export const getSeverityColor = (severity: string = ''): string => {
  const level = severity.toLowerCase();
  switch (level) {
    case 'critical':
      return 'text-[#FF0000]'; // Bright Red
    case 'high':
      return 'text-[#FFA500]'; // Orange
    case 'medium':
      return 'text-[#FFFF00]'; // Yellow
    case 'low':
      return 'text-[#008000]'; // Green
    default:
      return 'text-[#0000FF]'; // Blue (Informational)
  }
};

export const getSeverityBgColor = (severity: string = ''): string => {
  const level = severity.toLowerCase();
  switch (level) {
    case 'critical':
      return 'bg-[#FF0000]/10'; // Red background
    case 'high':
      return 'bg-[#FFA500]/10'; // Orange background
    case 'medium':
      return 'bg-[#FFFF00]/10'; // Yellow background
    case 'low':
      return 'bg-[#008000]/10'; // Green background
    default:
      return 'bg-[#0000FF]/10'; // Blue background
  }
};