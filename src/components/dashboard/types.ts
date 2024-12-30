export interface Alert {
  id: number;
  system_time: string;
  user_id: string;
  computer_name: string;
  ip_address: string;
  title: string;
  tags: string;
  rule_level: 'critical' | 'high' | 'medium' | 'low';
  ruleid: string;
  event_id: string;
  provider_name: string;
  task: string;
  raw: string;
  dbscan_cluster: number;
}

export interface Stats {
  uniqueUsers: {
    current: number;
    change: number;
    users: string[];
  };
  uniqueComputers: {
    current: number;
    change: number;
    computers: string[];
  };
  riskScore: {
    current: number;
    change: number;
  };
  anomalies: {
    current: number;
    change: number;
  };
  severity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  uniqueIPs: number;
  totalEvents: number;
  totalAnomalies: number;
}