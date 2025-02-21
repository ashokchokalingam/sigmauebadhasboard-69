
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LogsTableProps {
  logs: any[];
}

const LogsTable = ({ logs }: LogsTableProps) => {
  if (!logs || !Array.isArray(logs) || logs.length === 0) {
    return (
      <div className="text-center py-4 text-gray-400">
        No logs available
      </div>
    );
  }

  console.log('Rendering logs table:', {
    logsCount: logs.length,
    firstLog: logs[0]
  });

  // Get all unique keys from the logs
  const keys = Array.from(new Set(logs.flatMap(log => Object.keys(log))));

  return (
    <ScrollArea className="h-[300px] rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {keys.map((key) => (
              <TableHead key={key} className="whitespace-nowrap">
                {key}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log, index) => (
            <TableRow key={index}>
              {keys.map((key) => (
                <TableCell key={key} className="whitespace-nowrap">
                  {typeof log[key] === 'object' ? JSON.stringify(log[key]) : String(log[key] || '')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default LogsTable;
