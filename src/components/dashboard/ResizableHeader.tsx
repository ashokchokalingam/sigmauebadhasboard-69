import { TableHead } from "@/components/ui/table";
import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useState } from "react";
import ColumnFilter from "./ColumnFilter";
import { Alert } from "./types";

interface ResizableHeaderProps {
  title: string;
  columnKey: string;
  onFilterChange: (column: string, value: string) => void;
  selectedValue: string;
  alerts: Alert[];
  defaultSize?: number;
  minSize?: number;
}

const ResizableHeader = ({
  title,
  columnKey,
  onFilterChange,
  selectedValue,
  alerts,
  defaultSize = 100,
  minSize = 50
}: ResizableHeaderProps) => {
  const [size, setSize] = useState(defaultSize);

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
    <TableHead className="group relative">
      <ResizablePanel 
        defaultSize={defaultSize} 
        minSize={minSize}
        onResize={setSize}
      >
        <div className="flex items-center gap-2 px-2">
          <ColumnFilter
            title={title}
            options={getUniqueValues(columnKey as keyof Alert)}
            onSelect={(value) => onFilterChange(columnKey, value)}
            selectedValue={selectedValue}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle 
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </TableHead>
  );
};

export default ResizableHeader;