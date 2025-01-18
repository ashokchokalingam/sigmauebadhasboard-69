import { TableCell } from "@/components/ui/table";
import { Monitor } from "lucide-react";

interface ComputerCellProps {
  computerName: string;
  onTimelineView: (type: "user" | "computer", id: string) => void;
}

const ComputerCell = ({ computerName, onTimelineView }: ComputerCellProps) => {
  return (
    <TableCell 
      className="px-6 cursor-pointer hover:text-blue-400 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onTimelineView("computer", computerName);
      }}
    >
      <div className="flex items-center gap-2">
        <Monitor className="h-4 w-4 text-slate-400" />
        <span>{computerName || '-'}</span>
      </div>
    </TableCell>
  );
};

export default ComputerCell;