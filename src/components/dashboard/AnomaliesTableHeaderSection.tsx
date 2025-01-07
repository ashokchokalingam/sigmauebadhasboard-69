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
        <CardTitle className="flex items-center gap-2 text-blue-100">
          <AlertTriangle className="h-5 w-5 text-blue-500" />
          Recent Events - Last 7 Days (Limited to 1000)
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