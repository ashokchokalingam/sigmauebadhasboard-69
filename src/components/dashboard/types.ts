export interface Alert {
  id: string;
  system_time: string;
  event_id: string;
  rule_id: string;
  rule_level: string;
  task_name: string;
  provider_name: string;
  process_name: string;
  process_id: string;
  original_file_name: string;
  computer_name: string;
  user_id: string;
  title: string;
  tags: string;
  ip_address?: string;
  dbscan_cluster: number;
  raw_log?: string; // Added for raw log data
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
    users: string[];
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