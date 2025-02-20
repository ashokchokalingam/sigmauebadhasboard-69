
export interface RiskyEntity {
  computer?: string;
  user?: string;
  cumulative_risk_score: string;
  unique_outliers: number;
  unique_tactics_count: string;
  unique_title_count: number;
  risk_trend?: number;  // Added: can be positive (up) or negative (down)
  last_seen?: string;   // Added: timestamp of last seen activity
}

export interface HighRiskWidgetProps {
  entityType: 'computer' | 'userOrigin' | 'userImpacted';
  title: string;
  apiEndpoint: string;
  searchPlaceholder?: string;
}
