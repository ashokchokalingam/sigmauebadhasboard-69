
import { Monitor } from "lucide-react";

interface ComputerCellProps {
  computerName: string;
  onTimelineView: (type: "user" | "computer", id: string) => void;
}

export const ComputerCell = ({ computerName, onTimelineView }: ComputerCellProps) => (
  <div className="flex items-center min-w-0">
    <Monitor className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
    <span 
      className="hover:text-blue-400 cursor-pointer truncate text-base font-medium whitespace-nowrap"
      onClick={(e) => {
        e.stopPropagation();
        onTimelineView("computer", computerName || '');
      }}
    >
      {computerName || '-'}
    </span>
  </div>
);
