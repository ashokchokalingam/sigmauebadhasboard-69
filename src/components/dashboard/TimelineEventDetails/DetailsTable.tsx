
import { Alert } from "../types";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface DetailsTableProps {
  event: Alert;
}

const DetailsTable = ({ event }: DetailsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Field</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          { label: 'Event ID', value: event.event_id },
          { label: 'Provider Name', value: event.provider_name },
          { label: 'Computer Name', value: event.computer_name },
          { label: 'Task', value: event.task },
          { label: 'User ID', value: event.user_id },
          { label: 'IP Address', value: event.ip_address },
          { label: 'Risk Level', value: event.rule_level },
          { label: 'Risk Score', value: event.risk }
        ].map(({ label, value }) => (
          <TableRow key={label}>
            <TableCell className="font-medium text-purple-400">{label}</TableCell>
            <TableCell>{value || 'N/A'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DetailsTable;
