import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ColumnFilter from "./ColumnFilter";
import { Alert } from "./types";

interface AnomaliesTableHeaderProps {
  alerts: Alert[];
  onFilterChange: (column: string, value: string) => void;
  filters: Record<string, string>;
  visibleColumns: string[];
}

const AnomaliesTableHeader = ({ alerts, onFilterChange, filters, visibleColumns }: AnomaliesTableHeaderProps) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const last7DaysAlerts = alerts.filter(alert => {
    const alertDate = new Date(alert.system_time);
    return alertDate >= sevenDaysAgo;
  });

  const getUniqueValues = (key: keyof Alert) => {
    const uniqueValues = Array.from(new Set(last7DaysAlerts.map(alert => {
      if (key === 'system_time') {
        return new Date(alert[key]).toLocaleTimeString();
      }
      return String(alert[key]);
    }))).filter(Boolean);
    
    return uniqueValues.sort();
  };

  const columns = [
    { key: "system_time", label: "Time" },
    { key: "computer_name", label: "Computer" },
    { key: "user_id", label: "User" },
    { key: "title", label: "Title" },
    { key: "tags", label: "Tactics" },
    { key: "description", label: "Description" },
    { key: "event_id", label: "Event ID" },
    { key: "provider_name", label: "Provider" },
    { key: "dbscan_cluster", label: "Cluster" },
    { key: "ip_address", label: "IP Address" },
    { key: "ruleid", label: "Rule ID" },
    { key: "rule_level", label: "Level" },
    { key: "task", label: "Task" },
    { key: "target_user_name", label: "Target User" },
    { key: "target_domain_name", label: "Target Domain" }
  ];

  return (
    <TableHeader className="sticky top-0 z-50 bg-black/90">
      <TableRow className="hover:bg-blue-950/30">
        {columns.map(column => 
          visibleColumns.includes(column.key) && (
            <TableHead 
              key={column.key} 
              className="text-blue-300 bg-black/90 backdrop-blur-sm border-b border-blue-500/10 whitespace-nowrap sticky top-0 text-left h-12 px-4"
            >
              {column.key === "techniques" ? (
                column.label
              ) : (
                <ColumnFilter
                  title={column.label}
                  options={getUniqueValues(column.key as keyof Alert)}
                  onSelect={(value) => onFilterChange(column.key, value)}
                  selectedValue={filters[column.key]}
                />
              )}
            </TableHead>
          )
        )}
        <TableHead className="text-blue-300 w-[50px] bg-black/90 backdrop-blur-sm border-b border-blue-500/10 sticky top-0 text-right"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default AnomaliesTableHeader;