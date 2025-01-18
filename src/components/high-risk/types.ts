export interface RiskyEntity {
  user?: string;
  computer?: string;
  cumulative_risk_score: string;
  unique_outliers: number;
  unique_tactics_count: string;
  unique_title_count: number;
}

export interface HighRiskWidgetProps {
  title: string;
  entityType: 'user-origin' | 'user-impacted' | 'asset';
  endpoint: string;
  dataKey: string;
}