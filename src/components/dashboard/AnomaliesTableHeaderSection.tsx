
import { ColumnSelector } from "./ColumnSelector";
import { Watch } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnomaliesTableHeaderSectionProps {
  visibleColumns: string[];
  onColumnToggle: (columns: string[]) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  dataSource: 'outliers' | 'logs';
  onDataSourceChange: (source: 'outliers' | 'logs') => void;
}

const AnomaliesTableHeaderSection = ({
  visibleColumns,
  onColumnToggle,
  onSelectAll,
  onDeselectAll,
  dataSource,
  onDataSourceChange
}: AnomaliesTableHeaderSectionProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-purple-900/20 bg-[#1A1F2C]">
      <div className="flex items-center gap-2">
        <Watch className="w-5 h-5 text-[#9b87f5]" />
        <h2 className="text-lg font-semibold text-[#9b87f5]">Chrono Analyzer</h2>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          className={`flex items-center gap-2 border-[#33C3F0]/20 transition-all duration-200 font-medium
            ${dataSource === 'logs' 
              ? 'bg-[#33C3F0]/10 text-[#33C3F0] border-[#33C3F0]/30 shadow-[0_0_10px_rgba(51,195,240,0.2)]' 
              : 'text-[#33C3F0]/70 hover:bg-[#33C3F0]/10 hover:border-[#33C3F0]/30 hover:text-[#33C3F0]'}`}
          onClick={() => onDataSourceChange('logs')}
        >
          Logs
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className={`flex items-center gap-2 border-[#33C3F0]/20 transition-all duration-200 font-medium
            ${dataSource === 'outliers' 
              ? 'bg-[#33C3F0]/10 text-[#33C3F0] border-[#33C3F0]/30 shadow-[0_0_10px_rgba(51,195,240,0.2)]' 
              : 'text-[#33C3F0]/70 hover:bg-[#33C3F0]/10 hover:border-[#33C3F0]/30 hover:text-[#33C3F0]'}`}
          onClick={() => onDataSourceChange('outliers')}
        >
          Outliers
        </Button>
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
