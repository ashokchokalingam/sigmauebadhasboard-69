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
  // Get data from last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const last7DaysAlerts = alerts.filter(alert => {
    const alertDate = new Date(alert.system_time);
    return alertDate >= sevenDaysAgo;
  });

  // Extract unique values for each column from filtered data
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
    { key: "user_id", label: "User" },
    { key: "computer_name", label: "Computer" },
    { key: "ip_address", label: "IP Address" },
    { key: "title", label: "Title" },
    { key: "tags", label: "Tactics" },
    { key: "techniques", label: "Techniques" },
    { key: "risk_score", label: "Risk Score" },
    { key: "dbscan_cluster", label: "DBSCAN Cluster" }
  ];

  return (
    <TableHeader className="sticky top-0 z-20 bg-black/90 backdrop-blur-sm">
      <TableRow className="hover:bg-blue-950/30">
        {columns.map(column => 
          visibleColumns.includes(column.key) && (
            <TableHead key={column.key} className="text-blue-300 bg-black/90">
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
        <TableHead className="text-blue-300 w-[50px] bg-black/90"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default AnomaliesTableHeader;