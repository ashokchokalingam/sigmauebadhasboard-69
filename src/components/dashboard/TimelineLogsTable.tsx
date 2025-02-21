
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/utils/dateTimeUtils";
import { Badge } from "@/components/ui/badge";

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
  const getRiskLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const formatColumnHeader = (column: string) => {
    return column
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderCellContent = (log: any, column: string) => {
    switch (column) {
      case 'system_time':
        return formatDateTime(log[column], false);
      case 'rule_level':
        return (
          <Badge 
            variant="outline" 
            className={getRiskLevelColor(log[column])}
          >
            {log[column]?.toUpperCase() || 'N/A'}
          </Badge>
        );
      case 'title':
      case 'description':
        return (
          <div className="max-w-md truncate">
            {log[column] || 'N/A'}
          </div>
        );
      default:
        return log[column] || 'N/A';
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.map((column) => (
              <TableHead key={column}>
                {formatColumnHeader(column)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log, index) => (
            <TableRow key={`${log.id || index}-${log.system_time}`}>
              {visibleColumns.map((column) => (
                <TableCell key={`${log.id || index}-${column}`}>
                  {renderCellContent(log, column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TimelineLogsTable;
