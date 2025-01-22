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
  return (
    <TableHead className={`p-0 ${isLastColumn ? 'pr-0' : ''}`}>
      <ResizablePanel defaultSize={defaultSize} minSize={minSize}>
        <div className="px-4 py-2">
          <div className="font-medium text-xs text-blue-400/70 uppercase tracking-wider">
            {title}
          </div>
          <ColumnFilter
            columnKey={columnKey}
            onFilterChange={onFilterChange}
            selectedValue={selectedValue}
            alerts={alerts}
          />
        </div>
      </ResizablePanel>
    </TableHead>
  );
};

export default ResizableHeader;