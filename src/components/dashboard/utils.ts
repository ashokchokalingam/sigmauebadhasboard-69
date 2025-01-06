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

export const extractTacticsAndTechniques = (tags: string) => {
  const tagArray = tags.split(',').map(tag => tag.trim());
  
  const tactics = tagArray
    .filter(tag => tag.includes('attack.') && !tag.toLowerCase().includes('t1'))
    .map(tag => tag.replace('attack.', ''))
    .map(tactic => tactic.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '));

  const techniques = tagArray
    .filter(tag => tag.toLowerCase().includes('t1'))
    .map(tag => tag.toUpperCase());

  return { tactics, techniques };
};