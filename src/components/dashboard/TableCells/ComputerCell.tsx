import { Monitor } from "lucide-react";
import BaseTableCell from "./BaseTableCell";

interface ComputerCellProps {
  computerName: string;
  onTimelineView: (type: "user" | "computer", id: string) => void;
}

const ComputerCell = ({ computerName, onTimelineView }: ComputerCellProps) => {
  return (
    <BaseTableCell 
      value={computerName || '-'}
      icon={Monitor}
      width="w-[120px]"
      onClick={(e) => {
        e.stopPropagation();
        onTimelineView("computer", computerName);
      }}
      tooltipContent={computerName}
    />
  );
};

export default ComputerCell;