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
  dbscan_cluster?: string;
  ip_address?: string;
  ruleid?: string;
  rule_level?: string;
  task?: string;
  target_domain_name?: string;
  tags: string;
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
}