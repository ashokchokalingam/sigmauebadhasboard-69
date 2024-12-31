export const defaultColumns = [
  { key: "system_time", label: "Time" },
  { key: "user_id", label: "User" },
  { key: "computer_name", label: "Computer" },
  { key: "ip_address", label: "IP Address" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "tags", label: "Tactics" },
  { key: "techniques", label: "Techniques" },
  { key: "risk_score", label: "Risk Score" },
  { key: "dbscan_cluster", label: "DBSCAN Cluster" },
  { key: "event_id", label: "Event ID" },
  { key: "provider_name", label: "Provider" },
  { key: "ruleid", label: "Rule ID" },
  { key: "rule_level", label: "Rule Level" },
  { key: "task", label: "Task" },
  { key: "target_user_name", label: "Target User" },
  { key: "target_domain_name", label: "Target Domain" },
  { key: "raw", label: "Raw Log" }
];

export type ColumnKey = typeof defaultColumns[number]['key'];