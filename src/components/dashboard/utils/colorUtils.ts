
export const getRiskLevelColor = (level: string | null | undefined): string => {
  if (!level) return 'text-[#0FA0CE]';
  
  switch (level.toLowerCase()) {
    case 'critical':
    case 'high':
      return 'text-[#ea384c]';
    case 'medium':
      return 'text-[#F97316]';
    case 'low':
      return 'text-[#28c76f]';
    default:
      return 'text-[#0FA0CE]';
  }
};

export const getRiskScoreColor = (score: number | string | null | undefined): string => {
  if (!score) return 'text-[#0FA0CE]';
  
  const numScore = typeof score === 'string' ? parseInt(score) : score;
  
  if (numScore >= 200) return 'text-[#ea384c]';
  if (numScore >= 100) return 'text-[#ea384c]'; // High is also red
  if (numScore >= 50) return 'text-[#F97316]';
  return 'text-[#28c76f]';
};

export const getRiskBackgroundColor = (level: string | null | undefined): string => {
  if (!level) return 'bg-[#0FA0CE]/10';
  
  switch (level.toLowerCase()) {
    case 'critical':
    case 'high':
      return 'bg-[#ea384c]/10';
    case 'medium':
      return 'bg-[#F97316]/10';
    case 'low':
      return 'bg-[#28c76f]/10';
    default:
      return 'bg-[#0FA0CE]/10';
  }
};

export const getRiskBorderColor = (level: string | null | undefined): string => {
  if (!level) return 'border-[#0FA0CE]/20';
  
  switch (level.toLowerCase()) {
    case 'critical':
    case 'high':
      return 'border-[#ea384c]/20';
    case 'medium':
      return 'border-[#F97316]/20';
    case 'low':
      return 'border-[#28c76f]/20';
    default:
      return 'border-[#0FA0CE]/20';
  }
};
