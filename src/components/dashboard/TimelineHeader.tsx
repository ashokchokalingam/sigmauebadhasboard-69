import { AlertTriangle } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import ColumnSelector from "./ColumnSelector";
import TimelineLoadingIndicator from "./TimelineLoadingIndicator";

interface TimelineHeaderProps {
  isLoading: boolean;
  columns: any[];
  visibleColumns: string[];
  onColumnToggle: (columns: string[]) => void;
}

const TimelineHeader = ({ 
  isLoading,
  columns,
  visibleColumns,
  onColumnToggle 
}: TimelineHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <CardTitle className="flex items-center gap-2 text-blue-100">
            <AlertTriangle className="h-5 w-5 text-blue-500" />
            Event Timeline
          </CardTitle>
          <TimelineLoadingIndicator isVisible={isLoading} />
        </div>
        <ColumnSelector
          columns={columns}
          visibleColumns={visibleColumns}
          onColumnToggle={onColumnToggle}
        />
      </div>
    </CardHeader>
  );
};

export default TimelineHeader;