export interface Alert {
  id: number;
  title: string;
  tags: string;
  description: string;
  system_time: string;
  computer_name: string;
  user_id: string;
  event_id: string;
  provider_name: string;
  dbscan_cluster: number;
  raw: string;
  ip_address: string;
  ruleid: string;
  rule_level: string;
  task: string;
}

export interface AnomaliesTableProps {
  alerts: Alert[];
}