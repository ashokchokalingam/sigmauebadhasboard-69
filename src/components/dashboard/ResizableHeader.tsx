
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
}

const ResizableHeader = ({
  title,
  columnKey,
  onFilterChange,
  selectedValue,
  alerts,
}: ResizableHeaderProps) => {
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
    <div className="w-full">
      <ColumnFilter
        title={title}
        options={getUniqueValues(columnKey as keyof Alert)}
        onSelect={(value) => onFilterChange(columnKey, value)}
        selectedValue={selectedValue}
      />
    </div>
  );
};

export default ResizableHeader;
