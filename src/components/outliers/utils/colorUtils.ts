
export const getRiskScoreColor = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return 'from-[#D32F2F] to-[#FF4444]';
    case 'high':
      return 'from-[#FF9800] to-[#FFA726]';
    case 'medium':
      return 'from-[#FFB74D] to-[#FFB732]';
    case 'low':
      return 'from-[#4ADE80] to-[#22C55E]';
    default:
      return 'from-[#9333EA] to-[#A855F7]';
  }
};

export const getSeverityColor = (severity: string = 'medium') => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return '#D32F2F';
    case 'high':
      return '#FF9800';
    case 'medium':
      return '#FFB74D';
    case 'low':
      return '#4ADE80';
    default:
      return '#9333EA';
  }
};
