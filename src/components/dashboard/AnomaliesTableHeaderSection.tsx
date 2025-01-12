import { AlertTriangle } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import ColumnSelector from "./ColumnSelector";

interface AnomaliesTableHeaderSectionProps {
  visibleColumns: string[];
  onColumnToggle: (columns: string[]) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const AnomaliesTableHeaderSection = ({
  visibleColumns,
  onColumnToggle,
  onSelectAll,
  onDeselectAll
}: AnomaliesTableHeaderSectionProps) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-purple-400" />
          <span className="text-purple-100 bg-gradient-to-r from-purple-500/20 via-purple-400/10 to-blue-500/20 px-4 py-1.5 rounded-md text-xl font-semibold tracking-wide shadow-lg">
            ChronoScope
          </span>
        </CardTitle>
        <ColumnSelector
          visibleColumns={visibleColumns}
          onColumnToggle={onColumnToggle}
          onSelectAll={onSelectAll}
          onDeselectAll={onDeselectAll}
        />
      </div>
    </div>
  );
};

export default AnomaliesTableHeaderSection;