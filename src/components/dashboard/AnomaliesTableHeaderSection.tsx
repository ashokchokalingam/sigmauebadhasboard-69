import { ColumnSelector } from "./ColumnSelector";
import { Watch } from "lucide-react";

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
    <div className="flex items-center justify-between p-4 border-b border-purple-900/20 bg-[#1A1F2C]">
      <div className="flex items-center gap-2">
        <Watch className="w-5 h-5 text-[#9b87f5]" />
        <h2 className="text-lg font-semibold text-[#9b87f5]">Chrono Analyzer</h2>
      </div>
      <div className="flex items-center space-x-4">
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