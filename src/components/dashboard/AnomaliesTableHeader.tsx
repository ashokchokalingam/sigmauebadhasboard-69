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
  const getDefaultSize = (columnKey: string): number => {
    switch (columnKey) {
      case 'system_time':
        return 140;
      case 'description':
        return 300;
      case 'risk':
        return 80; // Increased slightly to prevent gap
      case 'user_id':
      case 'target_user_name':
        return 120; // Made consistent with other columns
      default:
        return 120;
    }
  };

  return (
    <TableHeader className="sticky top-0 z-50 bg-[#1a1f2c] w-full">
      <TableRow className="hover:bg-[#1a1f2c]/80 border-b border-blue-500/20">
        {allColumns
          .filter(column => visibleColumns.includes(column.key))
          .map((column, index) => (
            <ResizableHeader
              key={column.key}
              title={column.label}
              columnKey={column.key}
              onFilterChange={onFilterChange}
              selectedValue={filters[column.key]}
              alerts={alerts}
              defaultSize={getDefaultSize(column.key)}
              minSize={60}
              isLastColumn={index === visibleColumns.length - 1}
            />
          ))}
      </TableRow>
    </TableHeader>
  );
};

export default AnomaliesTableHeader;