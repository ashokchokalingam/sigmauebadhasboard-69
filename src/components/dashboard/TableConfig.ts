export const defaultColumns = [
  { key: "title", label: "Title" },
  { key: "tags", label: "Tactics" },
  { key: "description", label: "Description" },
  { key: "system_time", label: "Time" },
  { key: "computer_name", label: "Computer" },
  { key: "user_id", label: "User Origin" },
  { key: "task", label: "Task" }
];

export type ColumnKey = typeof defaultColumns[number]['key'];