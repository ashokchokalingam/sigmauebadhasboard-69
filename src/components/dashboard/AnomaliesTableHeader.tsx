
import { TableHeader, TableRow } from "@/components/ui/table";
import { Alert } from "./types";
import { allColumns } from "./TableConfig";
import ResizableHeader from "./ResizableHeader";

interface AnomaliesTableHeaderProps {
  alerts: Alert[];
  onFilterChange: (column: string, value: string) => void;
  filters: Record<string, string>;
  visibleColumns: string[];
}

const AnomaliesTableHeader = ({ 
  alerts, 
  onFilterChange, 
  filters, 
  visibleColumns 
}: AnomaliesTableHeaderProps) => {
  return (
    <TableRow className="bg-[#1a1f2c] border-b border-blue-500/20">
      {allColumns
        .filter(column => visibleColumns.includes(column.key))
        .map(column => (
          <ResizableHeader
            key={column.key}
            title={column.label}
            columnKey={column.key}
            onFilterChange={onFilterChange}
            selectedValue={filters[column.key]}
            alerts={alerts}
          />
        ))}
    </TableRow>
  );
};

export default AnomaliesTableHeader;
