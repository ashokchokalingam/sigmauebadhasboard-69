export interface Alert {
  id: string;
  title: string | null;
  tags: string | null;
  description: string | null;
  system_time: string | null;
  computer_name: string | null;
  user_id: string | null;
  event_id: string | null;
  provider_name: string | null;
  dbscan_cluster: number | null;
  raw: string | null;
  ip_address: string | null;
  ruleid: string | null;
  rule_level: string | null;
  task: string | null;
  target_user_name: string | null;
  target_domain_name: string | null;
  severity?: string;
  risk_score?: number;
  is_anomaly?: boolean;
}

export interface User {
  id: string;
  risk_score: number;
}

export interface Stats {
  totalEvents: number;
  severity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  uniqueUsers: {
    current: number;
    change: number;
    users: User[];
  };
  uniqueComputers: {
    current: number;
    change: number;
    computers: string[];
  };
  uniqueIPs: number;
  riskScore: {
    current: number;
    change: number;
  };
  anomalies: {
    current: number;
    change: number;
  };
}