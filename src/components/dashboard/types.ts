export interface Alert {
  id: string;
  title: string;
  description: string;
  system_time: string;
  first_time_seen?: string;
  last_time_seen?: string;
  user_id?: string;
  target_user_name?: string;
  computer_name?: string;
  event_id?: string;
  provider_name?: string;
  ml_cluster?: number;  // Changed from dbscan_cluster
  ip_address?: string;
  ruleid?: string;
  rule_level?: string;
  task?: string;
  target_domain_name?: string;
  raw?: string | object;
  total_events?: number;
  user_impacted: string;
  user_origin?: string;
  tactics?: string;
  techniques?: string;
  ml_description?: string;
  risk?: number;
  tags: string;  // Added back as it's still referenced in components
}

export interface EventSummary extends Alert {
  first_time_seen: string;
  last_time_seen: string;
  total_events: number;
  user_impacted: string;
}

export interface TimelineResponse {
  user_impacted_timeline: EventSummary[];
}

export interface Stats {
  total: number;
  high: number;
  medium: number;
  low: number;
  lastDay: number;
  totalEvents?: number;
  severity?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    informational: number;
  };
  uniqueUsers?: {
    current: number;
    users: Array<{ id: string; risk_score: number }>;
  };
  uniqueComputers?: {
    current: number;
    computers: string[];
  };
  anomalies?: {
    current: number;
  };
}

export interface Column {
  key: string;
  label: string;
}