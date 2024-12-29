export const extractTacticsAndTechniques = (tags: string) => {
  const tagArray = tags.split(',').map(t => t.trim());
  const tactics: string[] = [];
  const techniques: string[] = [];

  tagArray.forEach(tag => {
    if (tag.includes('t1') || tag.includes('T1')) {
      techniques.push(tag.toUpperCase());
    } else if (tag.includes('attack.')) {
      tactics.push(tag.replace('attack.', '').toLowerCase());
    }
  });

  return {
    tactics: tactics.join(', '),
    techniques: techniques.join(', ')
  };
};

export const getRiskScore = (alert: Alert) => {
  let score = 5; // Base score
  
  // Increase score for critical rules
  if (alert.rule_level === 'critical') score += 3;
  
  // Increase score for outliers
  if (alert.dbscan_cluster === -1) score += 2;
  
  return Math.min(10, score);
};

export const getRiskColor = (score: number) => {
  if (score >= 7) return "text-red-500";
  if (score >= 4) return "text-yellow-500";
  return "text-green-500";
};