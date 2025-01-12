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
          <AlertTriangle className="h-5 w-5 text-purple-400" />
          <div className="flex items-center gap-4">
            <span className="text-purple-100 bg-gradient-to-r from-purple-500/20 via-purple-400/10 to-blue-500/20 px-4 py-1.5 rounded-md text-xl font-semibold tracking-wide shadow-lg">
              ChronoScope
            </span>
            <span className="text-sm text-purple-300/80 italic border-l border-purple-500/30 pl-4 font-light tracking-wide">
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