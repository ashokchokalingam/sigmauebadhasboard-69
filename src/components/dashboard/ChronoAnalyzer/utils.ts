
export const getRiskLevelColor = (level: string = '') => {
  switch (level.toLowerCase()) {
    case 'critical':
    case 'high':
      return 'text-red-400';
    case 'medium':
      return 'text-yellow-400';
    case 'low':
      return 'text-green-400';
    default:
      return 'text-gray-400';
  }
};

export const getRiskScoreColor = (score: number) => {
  if (score >= 80) return 'text-red-400';
  if (score >= 60) return 'text-orange-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-green-400';
};

export const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString();
};
