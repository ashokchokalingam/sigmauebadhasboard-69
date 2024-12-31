export const defaultColumns = [
  { key: "system_time", label: "Time" },
  { key: "user_id", label: "User Origin" },
  { key: "computer_name", label: "Computer" },
  { key: "ip_address", label: "IP Address" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "tags", label: "Tactics" },
  { key: "techniques", label: "Techniques" },
  { key: "risk_score", label: "Risk Score" },
  { key: "dbscan_cluster", label: "ML Outlier" },
  { key: "event_id", label: "Event ID" },
  { key: "provider_name", label: "Provider" },
  { key: "ruleid", label: "Rule ID" },
  { key: "rule_level", label: "Rule Level" },
  { key: "task", label: "Task" },
  { key: "target_user_name", label: "Target User" },
  { key: "target_domain_name", label: "Target Domain" }
];

// These are additional columns that can be toggled but aren't shown by default
export const additionalColumns = [];

export const allColumns = [...defaultColumns];

export type ColumnKey = typeof allColumns[number]['key'];

// Define which columns should be visible by default
export const defaultVisibleColumns = [
  "system_time",
  "user_id", 
  "computer_name",
  "ip_address",
  "title",
  "description",
  "tags",
  "techniques",
  "risk_score",
  "dbscan_cluster",
  "event_id",
  "provider_name",
  "ruleid",
  "rule_level",
  "task",
  "target_user_name",
  "target_domain_name"
];