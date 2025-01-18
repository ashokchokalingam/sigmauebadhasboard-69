import { TableCell } from "@/components/ui/table";

interface ComputerCellProps {
  computerName: string;
  onTimelineView: (type: "user" | "computer", id: string) => void;
}

const ComputerCell = ({ computerName, onTimelineView }: ComputerCellProps) => {
  return (
    <TableCell 
      className="px-6 min-w-[200px] text-blue-100 whitespace-nowrap cursor-pointer hover:text-blue-400 transition-colors font-mono"
      onClick={(e) => {
        e.stopPropagation();
        onTimelineView("computer", computerName || '');
      }}
    >
      {computerName || 'N/A'}
    </TableCell>
  );
};

export default ComputerCell;