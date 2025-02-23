export interface MLOutlier {
  anomaly_count: number;
  first_seen: string;
  impacted_computers: string;
  last_seen: string;
  ml_description: string;
  origin_users: string | null;
  risk: number | null;
  severity: "high" | "medium" | "low" | "informational";
  source_ips: string | null;
  tactics: string | null;
  techniques: string | null;
  title: string;
}

export interface ChartDataPoint {
  timestamp: string;
  firstSeen: string;
  lastSeen: string;
  count: number;
  risk: number;
  severity: string;
  title: string;
  description: string;
  tactics: string[];
  impactedComputers: string[];
  impactedUsers: string[];
}

export interface StatsData {
  total: number;
  high: number;
  medium: number;
  low: number;
}

export interface ImpactedCounts {
  computers: number;
  users: number;
}