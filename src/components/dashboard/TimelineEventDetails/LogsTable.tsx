
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface LogsTableProps {
  logs: any[];
}

const LogsTable = ({ logs }: LogsTableProps) => {
  if (!Array.isArray(logs) || logs.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={3} className="text-center">No logs available</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Timestamp</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log: any, index: number) => (
          <TableRow key={index}>
            <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
            <TableCell>{log.event}</TableCell>
            <TableCell>{log.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LogsTable;
