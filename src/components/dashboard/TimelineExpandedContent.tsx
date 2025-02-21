
import { TableCell, TableRow } from "@/components/ui/table";
import AlertDetailsView from "./AlertDetailsView";
import { Alert } from "./types";

interface TimelineExpandedContentProps {
  log: Alert;
}

const TimelineExpandedContent = ({ log }: TimelineExpandedContentProps) => {
  return (
    <TableRow>
      <TableCell colSpan={10} className="p-0">
        <AlertDetailsView 
          alert={log} 
          onClose={() => {}} // We don't need the close functionality in this context
        />
      </TableCell>
    </TableRow>
  );
};

export default TimelineExpandedContent;
