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

  const getUniqueValues = (columnKey: string): string[] => {
    switch (columnKey) {
      case 'users':
        const userSet = new Set<string>();
        last7DaysAlerts.forEach(alert => {
          if (alert.user_id) userSet.add(alert.user_id);
          if (alert.target_user_name) userSet.add(alert.target_user_name);
        });
        return Array.from(userSet).filter(Boolean);

      case 'system_time':
        return Array.from(new Set(
          last7DaysAlerts.map(alert => 
            new Date(alert.system_time).toLocaleTimeString()
          )
        )).filter(Boolean);

      default:
        const values = last7DaysAlerts
          .map(alert => String(alert[columnKey as keyof Alert] || ''))
          .filter(Boolean);
        return Array.from(new Set(values));
    }
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
                options={getUniqueValues(column.key)}
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