
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
    <div className="border-t border-blue-500/20 mt-4">
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

      <div className="max-h-[300px] overflow-y-auto px-4">
        <Table>
          <thead className="bg-blue-950/30">
            <tr>
              {visibleColumns.map((column) => (
                <th 
                  key={column} 
                  className="py-2 px-4 text-left text-xs font-medium text-blue-300 first:rounded-l-md last:rounded-r-md"
                >
                  {column.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr 
                key={`${log.id || log._id || index}`} 
                className="border-t border-blue-500/20 hover:bg-blue-950/30"
              >
                {visibleColumns.map((column) => (
                  <td 
                    key={`${log.id || log._id || index}-${column}`} 
                    className="px-4 py-2 text-xs text-blue-200"
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

