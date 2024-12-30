import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ColumnFilter from "./ColumnFilter";
import { Alert } from "./types";

interface AnomaliesTableHeaderProps {
  alerts: Alert[];
  onFilterChange: (column: string, value: string) => void;
  filters: Record<string, string>;
}

const AnomaliesTableHeader = ({ alerts, onFilterChange, filters }: AnomaliesTableHeaderProps) => {
  // Get data from last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const last7DaysAlerts = alerts.filter(alert => {
    const alertDate = new Date(alert.system_time);
    return alertDate >= sevenDaysAgo && alert.dbscan_cluster === -1;
  });

  // Extract unique values for each column from filtered data
  const getUniqueValues = (key: keyof Alert) => {
    const uniqueValues = Array.from(new Set(last7DaysAlerts.map(alert => {
      if (key === 'system_time') {
        // Format the time to show only HH:MM:SS
        return new Date(alert[key]).toLocaleTimeString();
      }
      return String(alert[key]);
    }))).filter(Boolean);
    
    // Sort values alphabetically
    return uniqueValues.sort();
  };

  return (
    <TableHeader>
      <TableRow className="hover:bg-blue-950/30">
        <TableHead className="text-blue-300">
          <ColumnFilter
            title="Time"
            options={getUniqueValues("system_time")}
            onSelect={(value) => onFilterChange("system_time", value)}
            selectedValue={filters["system_time"]}
          />
        </TableHead>
        <TableHead className="text-blue-300">
          <ColumnFilter
            title="User"
            options={getUniqueValues("user_id")}
            onSelect={(value) => onFilterChange("user_id", value)}
            selectedValue={filters["user_id"]}
          />
        </TableHead>
        <TableHead className="text-blue-300">
          <ColumnFilter
            title="Computer"
            options={getUniqueValues("computer_name")}
            onSelect={(value) => onFilterChange("computer_name", value)}
            selectedValue={filters["computer_name"]}
          />
        </TableHead>
        <TableHead className="text-blue-300">
          <ColumnFilter
            title="IP Address"
            options={getUniqueValues("ip_address")}
            onSelect={(value) => onFilterChange("ip_address", value)}
            selectedValue={filters["ip_address"]}
          />
        </TableHead>
        <TableHead className="text-blue-300">
          <ColumnFilter
            title="Title"
            options={getUniqueValues("title")}
            onSelect={(value) => onFilterChange("title", value)}
            selectedValue={filters["title"]}
          />
        </TableHead>
        <TableHead className="text-blue-300">
          <ColumnFilter
            title="Tactics"
            options={getUniqueValues("tags")}
            onSelect={(value) => onFilterChange("tags", value)}
            selectedValue={filters["tags"]}
          />
        </TableHead>
        <TableHead className="text-blue-300">Techniques</TableHead>
        <TableHead className="text-blue-300">Risk Score</TableHead>
        <TableHead className="text-blue-300">DBSCAN Cluster</TableHead>
        <TableHead className="text-blue-300 w-[50px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default AnomaliesTableHeader;