
export const getSeverityColor = (severity: string): string => {
  const level = severity.toLowerCase();
  switch (level) {
    case 'critical':
      return 'text-red-400';
    case 'high':
      return 'text-orange-400';
    case 'medium':
      return 'text-yellow-400';
    case 'low':
      return 'text-green-400';
    default:
      return 'text-blue-400';
  }
};

export const getRiskLevel = (level: string = 'low') => {
  switch (level.toLowerCase()) {
    case 'critical':
      return { 
        color: 'text-red-400', 
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        hover: 'hover:border-red-500/50',
        cardBg: 'bg-red-950/20'
      };
    case 'high':
      return { 
        color: 'text-orange-400', 
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        hover: 'hover:border-orange-500/50',
        cardBg: 'bg-orange-950/20'
      };
    case 'medium':
      return { 
        color: 'text-yellow-400', 
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
        hover: 'hover:border-yellow-500/40',
        cardBg: 'bg-yellow-950/10'
      };
    default:
      return { 
        color: 'text-green-400', 
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        hover: 'hover:border-green-500/40',
        cardBg: 'bg-green-950/10'
      };
  }
};
