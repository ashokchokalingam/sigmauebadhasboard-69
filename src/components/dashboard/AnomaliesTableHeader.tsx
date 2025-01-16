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
    const valueSet = new Set<string>();
    last7DaysAlerts.forEach(alert => {
      const value = alert[columnKey as keyof Alert];
      if (value) valueSet.add(String(value));
    });
    return Array.from(valueSet).filter(Boolean);
  };

  return (
    <TableHeader className="sticky top-0 z-50 bg-[#1A1A2E]/80 backdrop-blur-sm">
      <TableRow className="border-b border-purple-500/20">
        {allColumns
          .filter(column => visibleColumns.includes(column.key))
          .map(column => (
            <TableHead 
              key={column.key} 
              className="text-purple-300 bg-[#2D2D44] first:rounded-tl-lg last:rounded-tr-lg h-12 font-medium text-sm"
            >
              <ColumnFilter
                title={column.label}
                options={getUniqueValues(column.key)}
                onSelect={(value) => onFilterChange(column.key, value)}
                selectedValue={filters[column.key]}
              />
            </TableHead>
          ))}
        <TableHead className="w-[50px] bg-[#2D2D44] border-b border-purple-500/20" />
      </TableRow>
    </TableHeader>
  );
};

export default AnomaliesTableHeader;