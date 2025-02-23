
import { Alert } from "./types";
import { Table } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
    <div className="border-t border-blue-500/10 mt-4">
      <div className="flex items-center justify-between p-4">
        <h3 className="text-sm font-medium text-blue-100">Detailed Logs</h3>
        <ToggleGroup
          type="single"
          value={dataSource}
          onValueChange={(value: any) => {
            if (value) onDataSourceChange(value as 'mloutliers' | 'anomalies');
          }}
          className="bg-blue-950/50 rounded-md"
        >
          <ToggleGroupItem value="anomalies" className="px-3 py-2 text-xs">
            Anomalies
          </ToggleGroupItem>
          <ToggleGroupItem value="mloutliers" className="px-3 py-2 text-xs">
            ML Outliers
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="max-h-[300px] overflow-y-auto">
        <Table>
          <thead>
            <tr className="border-b border-blue-500/10">
              {visibleColumns.map((column) => (
                <th 
                  key={column} 
                  className="bg-[#0B1120] py-2 px-4 text-left text-xs font-medium text-blue-300/70"
                >
                  {column.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-[#080B17]">
            {logs.map((log, index) => (
              <tr 
                key={`${log.id || log._id || index}`} 
                className="border-b border-blue-500/10 hover:bg-blue-950/30 transition-colors"
              >
                {visibleColumns.map((column) => (
                  <td 
                    key={`${log.id || log._id || index}-${column}`} 
                    className="px-4 py-2.5 text-xs text-blue-200/90"
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

