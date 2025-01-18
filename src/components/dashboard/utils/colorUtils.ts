export const getRiskColor = (level: string = ''): string => {
  const l = level.toLowerCase();
  switch (l) {
    case 'critical':
      return 'text-[#9b87f5]'; // Primary Purple
    case 'high':
      return 'text-[#7E69AB]'; // Secondary Purple
    case 'medium':
      return 'text-[#6E59A5]'; // Tertiary Purple
    case 'low':
      return 'text-[#D6BCFA]'; // Light Purple
    default:
      return 'text-[#9b87f5]'; // Primary Purple
  }
};

export const getRiskBgColor = (level: string = ''): string => {
  const l = level.toLowerCase();
  switch (l) {
    case 'critical':
      return 'bg-[#9b87f5]/20';
    case 'high':
      return 'bg-[#7E69AB]/20';
    case 'medium':
      return 'bg-[#6E59A5]/20';
    case 'low':
      return 'bg-[#D6BCFA]/20';
    default:
      return 'bg-[#9b87f5]/20';
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
