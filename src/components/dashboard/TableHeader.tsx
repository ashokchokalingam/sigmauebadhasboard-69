import { TableHead, TableRow } from "@/components/ui/table";
import ColumnFilter from "./ColumnFilter";
import { Alert } from "./types";
import { defaultColumns } from "./TableConfig";

interface TableHeaderProps {
  alerts: Alert[];
  onFilterChange: (column: string, value: string) => void;
  filters: Record<string, string>;
  visibleColumns: string[];
}

const TableHeaderComponent = ({ alerts, onFilterChange, filters, visibleColumns }: TableHeaderProps) => {
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

  return (
    <thead>
      <TableRow className="hover:bg-blue-950/30">
        {defaultColumns.map(column => 
          visibleColumns.includes(column.key) && (
            <TableHead key={column.key} className="text-blue-300">
              <ColumnFilter
                title={column.label}
                options={getUniqueValues(column.key as keyof Alert)}
                onSelect={(value) => onFilterChange(column.key, value)}
                selectedValue={filters[column.key]}
              />
            </TableHead>
          )
        )}
        <TableHead className="text-blue-300 w-[50px]"></TableHead>
      </TableRow>
    </thead>
  );
};

export default TableHeaderComponent;