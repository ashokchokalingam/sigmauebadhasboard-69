export interface Alert {
  id: string;
  title: string;
  description: string;
  system_time: string;
  user_id?: string;
  target_user_name?: string;
  computer_name?: string;
  event_id?: string;
  provider_name?: string;
  dbscan_cluster?: number;  // Changed from string to number
  ip_address?: string;
  ruleid?: string;
  rule_level?: string;
  task?: string;
  target_domain_name?: string;
  tags: string;
  raw?: string | object;  // Added raw property
}

export interface EventSummary {
  title: string;
  description: string;
  tags: string;
  first_time_seen: string;
  last_time_seen: string;
  total_events: number;
  user_impacted?: string;
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
  totalEvents?: number;  // Added for alertUtils.ts
  severity?: {  // Added for StatsSection.tsx
    critical: number;
    high: number;
  };
  uniqueUsers?: {  // Added for StatsSection.tsx
    current: number;
    users: Array<{ id: string; risk_score: number }>;
  };
  uniqueComputers?: {  // Added for StatsSection.tsx
    current: number;
    computers: string[];
  };
  anomalies?: {  // Added for StatsSection.tsx
    current: number;
  };
}