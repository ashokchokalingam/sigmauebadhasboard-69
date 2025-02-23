
import { Alert } from "./types";
import { Table } from "@/components/ui/table";
import { SegmentedControl } from "@radix-ui/themes";

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
    <div className="border-t border-blue-500/20 mt-4 pt-4">
      <div className="flex items-center justify-between mb-4 px-4">
        <h3 className="text-sm font-medium text-blue-100">Detailed Logs</h3>
        <SegmentedControl
          value={dataSource}
          onValueChange={(value: any) => onDataSourceChange(value)}
          className="bg-blue-950/50"
        >
          <button value="anomalies">Anomalies</button>
          <button value="mloutliers">ML Outliers</button>
        </SegmentedControl>
      </div>

      <div className="max-h-[300px] overflow-y-auto">
        <Table>
          <thead>
            <tr>
              {visibleColumns.map((column) => (
                <th key={column} className="px-4 py-2 text-left text-sm font-medium text-blue-300">
                  {column.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={`${log.id || log._id || index}`} className="border-t border-blue-500/20">
                {visibleColumns.map((column) => (
                  <td key={`${log.id || log._id || index}-${column}`} className="px-4 py-2 text-sm text-blue-200">
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
