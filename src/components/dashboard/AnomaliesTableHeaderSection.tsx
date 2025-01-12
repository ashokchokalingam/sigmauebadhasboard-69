import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import ColumnSelector from "./ColumnSelector";

interface AnomaliesTableHeaderSectionProps {
  visibleColumns: string[];
  onColumnToggle: (columns: string[]) => void;
}

const AnomaliesTableHeaderSection = ({ 
  visibleColumns, 
  onColumnToggle 
}: AnomaliesTableHeaderSectionProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-blue-500" />
          <div className="flex items-center gap-6">
            <span className="text-blue-100 bg-gradient-to-r from-blue-400/10 to-purple-400/10 px-4 py-1.5 rounded-md text-xl font-semibold tracking-wide">
              ChronoScope
            </span>
            <span className="text-sm text-blue-300/70 italic border-l border-blue-500/20 pl-6">
              "Analyzing time with precision"
            </span>
          </div>
        </CardTitle>
        <ColumnSelector
          visibleColumns={visibleColumns}
          onColumnToggle={onColumnToggle}
        />
      </div>
    </CardHeader>
  );
};

export default AnomaliesTableHeaderSection;