import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ColumnFilter from "./ColumnFilter";
import { Alert } from "./types";
import { defaultColumns } from "./TableConfig";

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
      if (key === 'users') {
        return [alert.user_id, alert.target_user_name].filter(Boolean);
      }
      return String(alert[key]);
    })).flat()).filter(Boolean);
    
    return uniqueValues.sort();
  };

  return (
    <TableHeader className="sticky top-0 z-50 bg-black/90">
      <TableRow className="hover:bg-blue-950/30">
        {defaultColumns
          .filter(column => visibleColumns.includes(column.key))
          .map(column => (
            <TableHead 
              key={column.key} 
              className="text-blue-300 bg-black/90 backdrop-blur-sm border-b border-blue-500/10 whitespace-nowrap sticky top-0"
            >
              <ColumnFilter
                title={column.label}
                options={getUniqueValues(column.key as keyof Alert)}
                onSelect={(value) => onFilterChange(column.key, value)}
                selectedValue={filters[column.key]}
              />
            </TableHead>
          ))}
        <TableHead className="text-blue-300 w-[50px] bg-black/90 backdrop-blur-sm border-b border-blue-500/10 sticky top-0"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default AnomaliesTableHeader;