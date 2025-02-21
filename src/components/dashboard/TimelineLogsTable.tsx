
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatDateTime } from "@/utils/dateTimeUtils";
import AnomaliesTableHeaderSection from "./AnomaliesTableHeaderSection";

interface TimelineLogsTableProps {
  logs: any[];
  visibleColumns: string[];
  dataSource: 'mloutliers' | 'anomalies';
  onDataSourceChange: (source: 'mloutliers' | 'anomalies') => void;
}

const TimelineLogsTable = ({ 
  logs,
  visibleColumns,
  dataSource,
  onDataSourceChange
}: TimelineLogsTableProps) => {
  if (!logs.length) return null;

  return (
    <div className="mt-4 bg-[#1A1F2C] rounded-lg overflow-hidden border border-purple-900/20">
      <AnomaliesTableHeaderSection
        visibleColumns={visibleColumns}
        onColumnToggle={() => {}}
        onSelectAll={() => {}}
        onDeselectAll={() => {}}
        dataSource={dataSource}
        onDataSourceChange={onDataSourceChange}
      />
      
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap px-4 py-2 bg-[#1A1F2C] text-[#9b87f5] border-b border-purple-900/20">
                Time
              </TableHead>
              <TableHead className="whitespace-nowrap px-4 py-2 bg-[#1A1F2C] text-[#9b87f5] border-b border-purple-900/20">
                Title
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow 
                key={index}
                className="border-b border-purple-900/10 hover:bg-purple-900/5"
              >
                <TableCell className="whitespace-nowrap px-4 py-2 text-blue-300/70">
                  {formatDateTime(log.system_time || '', false)}
                </TableCell>
                <TableCell className="whitespace-nowrap px-4 py-2 text-blue-300/70">
                  {log.title || ''}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TimelineLogsTable;

