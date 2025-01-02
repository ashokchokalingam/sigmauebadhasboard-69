export const defaultColumns = [
  { key: "system_time", label: "Time" },
  { key: "users", label: "Users" },
  { key: "computer_name", label: "Computer" },
  { key: "title", label: "Title" },
  { key: "tags", label: "Tactics" },
  { key: "description", label: "Description" }
];

export const allColumns = [
  ...defaultColumns,
  { key: "event_id", label: "Event ID" },
  { key: "provider_name", label: "Provider" },
  { key: "dbscan_cluster", label: "Cluster" },
  { key: "ip_address", label: "IP Address" },
  { key: "ruleid", label: "Rule ID" },
  { key: "rule_level", label: "Level" },
  { key: "task", label: "Task" },
  { key: "target_domain_name", label: "Target Domain" },
  { key: "raw", label: "Raw Log" }
];