
import { TableCell, TableRow } from "@/components/ui/table";
import AlertDetailsView from "./AlertDetailsView";
import { Alert } from "./types";

interface TimelineExpandedContentProps {
  log: Alert;
  onClose: () => void;
}

const TimelineExpandedContent = ({ log, onClose }: TimelineExpandedContentProps) => {
  return (
    <TableRow>
      <TableCell colSpan={10} className="p-0">
        <AlertDetailsView 
          alert={log} 
          onClose={onClose}
        />
      </TableCell>
    </TableRow>
  );
};

export default TimelineExpandedContent;
