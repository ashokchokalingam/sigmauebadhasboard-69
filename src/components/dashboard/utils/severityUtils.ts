export const getSeverityColor = (severity: string = ''): string => {
  const level = severity.toLowerCase();
  switch (level) {
    case 'critical':
      return 'text-[#ea384c]'; // Red
    case 'high':
      return 'text-[#F97316]'; // Orange
    case 'medium':
      return 'text-[#3B82F6]'; // Blue
    case 'low':
      return 'text-[#22C55E]'; // Green
    default:
      return 'text-[#3B82F6]'; // Blue (Informational)
  }
};

export const getSeverityBgColor = (severity: string = ''): string => {
  const level = severity.toLowerCase();
  switch (level) {
    case 'critical':
      return 'bg-[#ea384c]/10'; // Red background
    case 'high':
      return 'bg-[#F97316]/10'; // Orange background
    case 'medium':
      return 'bg-[#3B82F6]/10'; // Blue background
    case 'low':
      return 'bg-[#22C55E]/10'; // Green background
    default:
      return 'bg-[#3B82F6]/10'; // Blue background
  }
};