
import { Alert } from "./types";
import { Table } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FileText, Clock } from "lucide-react";
import TableCell from "./TableComponents/TableCell";
import TableRow from "./TableComponents/TableRow";

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
    <div className="mt-4">
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600/10 scrollbar-track-transparent">
        <Table>
          <thead>
            <tr className="border-b border-slate-800 bg-[#0A0D14]">
              {visibleColumns.map((column) => (
                <th 
                  key={column} 
                  className="p-3 text-left text-xs font-medium text-slate-400/80 first:pl-4"
                >
                  {column.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-[#070B14]">
            {logs.map((log, index) => (
              <tr 
                key={`${log.id || log._id || index}`} 
                className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
              >
                {visibleColumns.map((column) => (
                  <td 
                    key={`${log.id || log._id || index}-${column}`} 
                    className="p-3 text-sm first:pl-4"
                  >
                    <TableCell 
                      alert={log}
                      columnKey={column}
                      onTimelineView={(type, id) => {}}
                    />
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

