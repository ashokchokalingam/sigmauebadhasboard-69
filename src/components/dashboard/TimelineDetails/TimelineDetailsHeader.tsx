import React from 'react';
import { Filter } from 'lucide-react';
import ColumnSelector from '../ColumnSelector';

interface TimelineDetailsHeaderProps {
  totalRecords?: number;
  visibleColumns: string[];
  onColumnToggle: (columns: string[]) => void;
}

const TimelineDetailsHeader = ({
  totalRecords,
  visibleColumns,
  onColumnToggle
}: TimelineDetailsHeaderProps) => {
  return (
    <div className="sticky top-0 z-20 p-4 flex justify-between items-center text-sm text-purple-200/80 border-b border-purple-400/20 bg-purple-400/5 backdrop-blur-sm">
      <div>
        <span className="font-semibold">Total Records:</span> {totalRecords?.toLocaleString()}
      </div>
      <ColumnSelector
        visibleColumns={visibleColumns}
        onColumnToggle={onColumnToggle}
      />
    </div>
  );
};

export default TimelineDetailsHeader;