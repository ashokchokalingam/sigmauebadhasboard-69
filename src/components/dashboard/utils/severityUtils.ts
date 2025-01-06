export const getSeverityColor = (severity: string = ''): string => {
  const level = severity.toLowerCase();
  switch (level) {
    case 'critical':
      return 'text-[#ea384c]'; // Red
    case 'high':
      return 'text-[#F97316]'; // Bright Orange
    case 'medium':
      return 'text-[#8B5CF6]'; // Vivid Purple
    case 'low':
      return 'text-[#8A898C]'; // Medium Gray
    default:
      return 'text-blue-400'; // Default color
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
      return 'bg-[#8B5CF6]/10'; // Purple background
    case 'low':
      return 'bg-[#8A898C]/10'; // Gray background
    default:
      return 'bg-blue-400/10'; // Default background
  }
};