import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ColumnFilter from "./ColumnFilter";
import { Alert } from "./types";
import { allColumns } from "./TableConfig";

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
      case 'users': {
        const userSet = new Set<string>();
        last7DaysAlerts.forEach(alert => {
          if (alert.user_id) userSet.add(alert.user_id);
          if (alert.target_user_name) userSet.add(alert.target_user_name);
        });
        return Array.from(userSet).filter((value): value is string => 
          typeof value === 'string' && value.length > 0
        );
      }

      case 'system_time': {
        const timeSet = new Set<string>();
        last7DaysAlerts.forEach(alert => {
          if (alert.system_time) {
            const timeString = new Date(alert.system_time).toLocaleTimeString();
            timeSet.add(timeString);
          }
        });
        return Array.from(timeSet).filter((value): value is string => 
          typeof value === 'string' && value.length > 0
        );
      }

      default: {
        const valueSet = new Set<string>();
        last7DaysAlerts.forEach(alert => {
          const value = alert[columnKey as keyof Alert];
          if (value) valueSet.add(String(value));
        });
        return Array.from(valueSet).filter((value): value is string => 
          typeof value === 'string' && value.length > 0
        );
      }
    }
  };

  return (
    <TableHeader className="sticky top-0 z-50 bg-[#2D2D44]">
      <TableRow className="hover:bg-[#3D3D54] border-b border-[#4D4D64]">
        {allColumns
          .filter(column => visibleColumns.includes(column.key))
          .map(column => (
            <TableHead 
              key={column.key} 
              className="text-purple-300 bg-[#2D2D44] backdrop-blur-sm border-b border-[#4D4D64] whitespace-nowrap sticky top-0 font-medium text-sm"
            >
              <ColumnFilter
                title={column.label}
                options={getUniqueValues(column.key)}
                onSelect={(value) => onFilterChange(column.key, value)}
                selectedValue={filters[column.key]}
              />
            </TableHead>
          ))}
        <TableHead className="text-purple-300 w-[50px] bg-[#2D2D44] backdrop-blur-sm border-b border-[#4D4D64] sticky top-0"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default AnomaliesTableHeader;