
import { Alert } from "../types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { toast } from "sonner";

interface DetailsTableProps {
  event: Alert;
}

const DetailsTable = ({ event }: DetailsTableProps) => {
  const [expandedCell, setExpandedCell] = useState<string | null>(null);

  const handleCellClick = (label: string, value: string) => {
    console.log('Cell clicked:', { label, value });
    setExpandedCell(expandedCell === label ? null : label);
    
    // Show toast with full value when clicked
    if (value) {
      toast.info(
        <div className="break-all">
          <strong>{label}:</strong> {value}
        </div>
      );
    }
  };

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
                <TableCell 
                  className="cursor-pointer hover:bg-slate-100/10 transition-colors"
                  onClick={() => handleCellClick(label, value)}
                >
                  <div className={`${expandedCell === label ? '' : 'truncate'}`}>
                    {value}
                  </div>
                </TableCell>
              </TableRow>
            )
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DetailsTable;
