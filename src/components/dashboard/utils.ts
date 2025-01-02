import { Alert } from "./types";

const TACTIC_BASE_SCORES: { [key: string]: number } = {
  'privilege_escalation': 9,
  'defense_evasion': 8,
  'persistence': 7,
  'credential_access': 8,
  'initial_access': 6,
  'execution': 7,
  'discovery': 5,
  'lateral_movement': 9,
  'collection': 6,
  'exfiltration': 8,
  'impact': 10
};

export const extractTacticsAndTechniques = (tags: string[] | null) => {
  if (!tags) return { tactics: '', techniques: [] };
  
  const tactics: string[] = [];
  const techniques: string[] = [];

  tags.forEach(tag => {
    if (tag.includes('t1') || tag.includes('T1')) {
      techniques.push(tag.toUpperCase());
    } else if (tag.includes('attack.')) {
      tactics.push(tag.replace('attack.', '').toLowerCase());
    }
  });

  return {
    tactics: tactics.join(', '),
    techniques
  };
};

export const getRiskScore = (alert: Alert) => {
  let score = 5; // Base score
  
  // Add score based on rule level
  if (alert.rule_level === 'critical') score += 3;
  if (alert.rule_level === 'high') score += 2;
  if (alert.rule_level === 'medium') score += 1;
  
  // Add score for outliers
  if (alert.dbscan_cluster === -1) score += 2;
  
  // Add scores based on tactics
  const { tactics } = extractTacticsAndTechniques(alert.tags);
  const tacticsList = tactics.split(', ');
  
  let maxTacticScore = 0;
  tacticsList.forEach(tactic => {
    const tacticScore = TACTIC_BASE_SCORES[tactic] || 0;
    maxTacticScore = Math.max(maxTacticScore, tacticScore);
  });
  
  // Add the highest tactic score (normalized to a 0-3 scale)
  score += (maxTacticScore / 10) * 3;

  // Ensure the final score doesn't exceed 10
  return Math.min(10, score);
};

export const getRiskColor = (score: number) => {
  if (score >= 8) return "text-red-500";
  if (score >= 6) return "text-orange-500";
  if (score >= 4) return "text-yellow-500";
  return "text-green-500";
};