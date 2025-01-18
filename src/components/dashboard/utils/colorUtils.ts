export const getRiskColor = (level: string = ''): string => {
  const l = level.toLowerCase();
  switch (l) {
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

export const getRiskBgColor = (level: string = ''): string => {
  const l = level.toLowerCase();
  switch (l) {
    case 'critical':
      return 'bg-[#FF0000]/20'; // Red background
    case 'high':
      return 'bg-[#FFA500]/20'; // Orange background
    case 'medium':
      return 'bg-[#FFFF00]/20'; // Yellow background
    case 'low':
      return 'bg-[#008000]/20'; // Green background
    default:
      return 'bg-[#0000FF]/20'; // Blue background
  }
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "text-[#FFA500]"; // Orange
    case "medium":
      return "text-[#FFFF00]"; // Yellow
    case "low":
      return "text-[#008000]"; // Green
    default:
      return "text-[#0000FF]"; // Blue (Informational)
  }
};

export const getSeverityBg = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-[#FFA500]/20"; // Orange background
    case "medium":
      return "bg-[#FFFF00]/20"; // Yellow background
    case "low":
      return "bg-[#008000]/20"; // Green background
    default:
      return "bg-[#0000FF]/20"; // Blue background
  }
};