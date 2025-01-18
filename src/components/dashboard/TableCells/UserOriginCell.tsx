import { TableCell } from "@/components/ui/table";
import { User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserOriginCellProps {
  userId: string;
  onTimelineView: (type: "user" | "computer", id: string) => void;
}

const UserOriginCell = ({ userId, onTimelineView }: UserOriginCellProps) => {
  return (
    <TableCell 
      className="px-2 py-1.5 w-[120px] flex-shrink-0 cursor-pointer hover:text-blue-400 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onTimelineView("user", userId);
      }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-[13px] truncate">{userId || '-'}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{userId}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};

export default UserOriginCell;