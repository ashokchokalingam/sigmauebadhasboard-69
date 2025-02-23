
import { Alert } from "./types";
import { Table } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FileText, Clock } from "lucide-react";

interface TimelineLogsTableProps {
  logs: any[];
  visibleColumns: string[];
  dataSource: 'mloutliers' | 'anomalies';
  onDataSourceChange: (value: 'mloutliers' | 'anomalies') => void;
}

const TimelineLogsTable = ({
  logs,
  visibleColumns,
  dataSource,
  onDataSourceChange
}: TimelineLogsTableProps) => {
  if (!logs || logs.length === 0) return null;

  return (
    <div className="mt-6 rounded-lg overflow-hidden bg-gradient-to-b from-blue-950/40 to-blue-900/10">
      <div className="flex items-center justify-between p-5 border-b border-blue-500/20">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-medium text-blue-100">Detailed Logs</h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
            {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
        <ToggleGroup
          type="single"
          value={dataSource}
          onValueChange={(value: any) => {
            if (value) onDataSourceChange(value as 'mloutliers' | 'anomalies');
          }}
          className="bg-blue-950/50 rounded-md border border-blue-500/20"
        >
          <ToggleGroupItem 
            value="anomalies" 
            className="px-3 py-1.5 text-xs data-[state=on]:bg-blue-500/20 data-[state=on]:text-blue-100"
          >
            Anomalies
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="mloutliers" 
            className="px-3 py-1.5 text-xs data-[state=on]:bg-blue-500/20 data-[state=on]:text-blue-100"
          >
            ML Outliers
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-blue-950/20">
        <Table>
          <thead>
            <tr className="border-b border-blue-500/20 bg-blue-950/40">
              {visibleColumns.map((column) => (
                <th 
                  key={column} 
                  className="py-3 px-5 text-left text-xs font-medium text-blue-300/70 first:flex first:items-center first:gap-2"
                >
                  {column === 'system_time' && <Clock className="w-3.5 h-3.5 text-blue-400" />}
                  {column.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-blue-950/20">
            {logs.map((log, index) => (
              <tr 
                key={`${log.id || log._id || index}`} 
                className="border-b border-blue-500/10 hover:bg-blue-900/20 transition-colors"
              >
                {visibleColumns.map((column) => (
                  <td 
                    key={`${log.id || log._id || index}-${column}`} 
                    className="px-5 py-3 text-xs text-blue-200/90"
                  >
                    {log[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default TimelineLogsTable;

