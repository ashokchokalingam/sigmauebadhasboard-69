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
        return 160; // Increased for better timestamp visibility
      case 'description':
        return 400; // Increased for better readability
      case 'risk':
        return 100; // Adjusted for risk score
      case 'user_origin':
      case 'user_impacted':
        return 150; // Increased for user information
      case 'computer_name':
        return 180; // Adjusted for computer names
      case 'ml_cluster':
        return 120; // Adjusted for ML cluster info
      default:
        return 140;
    }
  };

  // Validate column visibility
  const validVisibleColumns = visibleColumns.filter(column => 
    allColumns.some(c => c.key === column)
  );

  return (
    <TableHeader className="sticky top-0 z-50 bg-[#1a1f2c]">
      <TableRow className="hover:bg-[#1a1f2c]/80 border-b border-blue-500/20">
        {allColumns
          .filter(column => validVisibleColumns.includes(column.key))
          .map(column => (
            <ResizableHeader
              key={column.key}
              title={column.label}
              columnKey={column.key}
              onFilterChange={onFilterChange}
              selectedValue={filters[column.key]}
              alerts={alerts}
              defaultSize={getDefaultSize(column.key)}
              minSize={80}
            />
          ))}
      </TableRow>
    </TableHeader>
  );
};

export default AnomaliesTableHeader;