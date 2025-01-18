export const getRiskColor = (level: string = ''): string => {
  const l = level.toLowerCase();
  switch (l) {
    case 'critical':
      return 'text-[#ea384c]'; // Red for Critical
    case 'high':
      return 'text-[#F97316]'; // Orange for High
    case 'medium':
      return 'text-[#3B82F6]'; // Blue for Medium
    case 'low':
      return 'text-[#22C55E]'; // Green for Low
    default:
      return 'text-[#3B82F6]'; // Default blue
  }
};

export const getRiskBgColor = (level: string = ''): string => {
  const l = level.toLowerCase();
  switch (l) {
    case 'critical':
      return 'bg-[#ea384c]/20'; // Red background
    case 'high':
      return 'bg-[#F97316]/20'; // Orange background
    case 'medium':
      return 'bg-[#3B82F6]/20'; // Blue background
    case 'low':
      return 'bg-[#22C55E]/20'; // Green background
    default:
      return 'bg-[#3B82F6]/20'; // Default blue background
  }
};

export const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'text-[#ea384c]'; // Red
    case 'high':
      return 'text-[#F97316]'; // Orange
    case 'medium':
      return 'text-[#3B82F6]'; // Blue
    case 'low':
      return 'text-[#22C55E]'; // Green
    default:
      return 'text-[#3B82F6]'; // Default blue
  }
};

export const getSeverityBg = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'bg-[#ea384c]/20'; // Red background
    case 'high':
      return 'bg-[#F97316]/20'; // Orange background
    case 'medium':
      return 'bg-[#3B82F6]/20'; // Blue background
    case 'low':
      return 'bg-[#22C55E]/20'; // Green background
    default:
      return 'bg-[#3B82F6]/20'; // Default blue background
  }
};