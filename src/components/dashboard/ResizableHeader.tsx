import { TableHead } from "@/components/ui/table";
import { Alert } from "./types";
import { ResizablePanel } from "@/components/ui/resizable";
import ColumnFilter from "./ColumnFilter";

interface ResizableHeaderProps {
  title: string;
  columnKey: string;
  onFilterChange: (column: string, value: string) => void;
  selectedValue: string;
  alerts: Alert[];
  defaultSize: number;
  minSize: number;
  isLastColumn?: boolean;
}

const ResizableHeader = ({
  title,
  columnKey,
  onFilterChange,
  selectedValue,
  alerts,
  defaultSize,
  minSize,
  isLastColumn
}: ResizableHeaderProps) => {
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
    <TableHead className={`p-0 ${isLastColumn ? 'pr-0' : ''}`}>
      <ResizablePanel defaultSize={defaultSize} minSize={minSize}>
        <div className="px-4 py-2">
          <div className="font-medium text-xs text-blue-400/70 uppercase tracking-wider">
            {title}
          </div>
          <ColumnFilter
            title={title}
            columnKey={columnKey}
            options={getUniqueValues(columnKey as keyof Alert)}
            onSelect={(value) => onFilterChange(columnKey, value)}
            selectedValue={selectedValue}
          />
        </div>
      </ResizablePanel>
    </TableHead>
  );
};

export default ResizableHeader;