
import { Alert } from "../types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface DetailsTableProps {
  event: Alert;
}

const DetailsTable = ({ event }: DetailsTableProps) => {
  const details = [
    { label: "Event ID", value: event.event_id },
    { label: "Computer Name", value: event.computer_name },
    { label: "User Origin", value: event.user_origin },
    { label: "User Impacted", value: event.user_impacted },
    { label: "Provider Name", value: event.provider_name },
    { label: "Rule Level", value: event.rule_level },
    { label: "System Time", value: event.system_time },
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableBody>
          {details.map(({ label, value }) => (
            value && (
              <TableRow key={label}>
                <TableCell className="font-medium w-1/3">{label}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            )
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DetailsTable;
