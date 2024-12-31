export const defaultColumns = [
  { key: "system_time", label: "Time" },
  { key: "user_id", label: "User Origin" },
  { key: "computer_name", label: "Computer" },
  { key: "ip_address", label: "IP Address" },
  { key: "title", label: "ThreatName" },
  { key: "tags", label: "Tactics" },
  { key: "techniques", label: "Techniques" },
  { key: "risk_score", label: "Risk Score" },
  { key: "rule_level", label: "Rule Level" },
  { key: "target_user_name", label: "Target User" },
  { key: "target_domain_name", label: "Target Domain" },
  { key: "dbscan_cluster", label: "ML Outlier" },
  { key: "event_id", label: "Event ID" },
  { key: "provider_name", label: "Provider" },
  { key: "ruleid", label: "Rule ID" },
  { key: "task", label: "Task" }
];

export type ColumnKey = typeof defaultColumns[number]['key'];