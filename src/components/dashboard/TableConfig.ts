export const defaultColumns = [
  { key: "system_time", label: "Time" },
  { key: "user_id", label: "User Origin" },
  { key: "computer_name", label: "Computer" },
  { key: "ip_address", label: "IP Address" },
  { key: "title", label: "ThreatName" },
  { key: "tags", label: "Tactics" },
  { key: "techniques", label: "Techniques" },
  { key: "risk_score", label: "Risk Score" },
  { key: "dbscan_cluster", label: "ML Outlier" }
];

export const additionalColumns = [
  { key: "rule_level", label: "Rule Level" },
  { key: "target_user_name", label: "Target User" },
  { key: "target_domain_name", label: "Target Domain" },
  { key: "event_id", label: "Event ID" },
  { key: "provider_name", label: "Provider" },
  { key: "ruleid", label: "Rule ID" },
  { key: "task", label: "Task" }
];

export const allColumns = [...defaultColumns, ...additionalColumns];

export type ColumnKey = typeof allColumns[number]['key'];

// Define which columns should be visible by default
export const defaultVisibleColumns = [
  "system_time",
  "user_id", 
  "computer_name",
  "ip_address",
  "title",
  "tags",
  "risk_score",
  "dbscan_cluster"
];