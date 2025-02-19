
import { TableHead } from "@/components/ui/table";
import { useState, useRef } from "react";
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
  defaultSize = 200,
  minSize = 100
}: ResizableHeaderProps) => {
  const [width, setWidth] = useState(defaultSize);
  const [isResizing, setIsResizing] = useState(false);
  const headerRef = useRef<HTMLTableCellElement>(null);

  const getUniqueValues = (key: keyof Alert) => {
    const values = alerts.map(alert => {
      const value = alert[key];
      if (value === null || value === undefined) return '—';
      if (key === 'system_time') {
        return new Date(value as string).toLocaleString();
      }
      if (key === 'ml_cluster' && typeof value === 'number') {
        return value.toString();
      }
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }
      return String(value);
    });
    
    return Array.from(new Set(values))
      .filter(value => value !== undefined && value !== null)
      .sort((a, b) => {
        if (a === '—') return 1;
        if (b === '—') return -1;
        return a.localeCompare(b);
      });
  };

  return (
    <TableHead 
      ref={headerRef}
      className="h-14 px-0 bg-[#1A1F2C] border-b border-blue-900/20"
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <ColumnFilter
          title={title}
          options={getUniqueValues(columnKey as keyof Alert)}
          onSelect={(value) => onFilterChange(columnKey, value)}
          selectedValue={selectedValue}
        />
      </div>
    </TableHead>
  );
};

export default ResizableHeader;
