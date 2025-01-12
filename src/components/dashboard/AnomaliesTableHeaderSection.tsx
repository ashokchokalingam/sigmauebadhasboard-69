import { ColumnSelector } from "./ColumnSelector";

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
    <div className="flex items-center justify-between p-4 border-b border-blue-500/10">
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