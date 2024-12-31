export const defaultColumns = [
  { key: "title", label: "Title" },
  { key: "tags", label: "Tactics" },
  { key: "description", label: "Description" },
  { key: "system_time", label: "Time" },
  { key: "computer_name", label: "Computer" },
  { key: "user_id", label: "User Origin" },
  { key: "event_id", label: "Event ID" },
  { key: "provider_name", label: "Provider" },
  { key: "dbscan_cluster", label: "ML Outlier" },
  { key: "ip_address", label: "IP Address" },
  { key: "ruleid", label: "Rule ID" },
  { key: "rule_level", label: "Rule Level" },
  { key: "task", label: "Task" },
  { key: "target_user_name", label: "Target User" },
  { key: "target_domain_name", label: "Target Domain" },
  { key: "raw", label: "Raw Data" }
];

// These are additional columns that can be toggled but aren't shown by default
export const additionalColumns = [];

export const allColumns = [...defaultColumns];

export type ColumnKey = typeof allColumns[number]['key'];

// Define which columns should be visible by default
export const defaultVisibleColumns = defaultColumns.map(col => col.key);