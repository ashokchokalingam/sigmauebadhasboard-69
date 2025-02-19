
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
        return 180;
      case 'description':
        return 400;
      case 'risk':
        return 100;
      case 'user_id':
      case 'target_user_name':
        return 140;
      case 'computer_name':
        return 160;
      case 'title':
        return 200;
      case 'ml_cluster':
        return 120;
      default:
        return 150;
    }
  };

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
            defaultSize={getDefaultSize(column.key)}
            minSize={100}
          />
        ))}
    </TableRow>
  );
};

export default AnomaliesTableHeader;
