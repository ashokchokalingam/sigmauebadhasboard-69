export const defaultColumns = [
  { key: "title", label: "Title" },
  { key: "tags", label: "Tactics" },
  { key: "description", label: "Description" },
  { key: "system_time", label: "Time" },
  { key: "computer_name", label: "Computer" },
  { key: "user_id", label: "User Origin" },
  { key: "task", label: "Task" }
];

export const additionalColumns = [
  { key: "event_id", label: "Event ID" },
  { key: "provider_name", label: "Provider" },
  { key: "ip_address", label: "IP Address" },
  { key: "ruleid", label: "Rule ID" },
  { key: "rule_level", label: "Rule Level" },
  { key: "target_user_name", label: "Target User" },
  { key: "target_domain_name", label: "Target Domain" }
];

export type ColumnKey = typeof defaultColumns[number]['key'];