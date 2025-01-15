export interface UserData {
  user_origin?: string;
  user_impacted?: string;
  unique_titles: number;
  total_unique_risk_score?: string;
}

export interface ComputerData {
  computer_name: string;
  unique_titles: number;
  total_unique_risk_score?: string;
}

export interface EntityData {
  id: string;
  eventCount: number;
  uniqueTitles: number;
  total_unique_risk_score?: string;
}