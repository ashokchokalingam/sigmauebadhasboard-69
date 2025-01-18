export interface RiskyEntity {
  computer?: string;
  user?: string;
  cumulative_risk_score: string;
  unique_outliers: number;
  unique_tactics_count: string;
  unique_title_count: number;
}

export interface HighRiskWidgetProps {
  entityType: 'computer' | 'userOrigin' | 'userImpacted';
  title: string;
  apiEndpoint: string;
  searchPlaceholder?: string;
}