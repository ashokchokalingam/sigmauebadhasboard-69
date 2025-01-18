import { TableCell } from "@/components/ui/table";
import { UserCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserImpactedCellProps {
  userName: string;
}

const UserImpactedCell = ({ userName }: UserImpactedCellProps) => {
  return (
    <TableCell className="px-2 py-1.5 w-[120px] flex-shrink-0">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-[13px] truncate">{userName || '-'}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{userName}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};

export default UserImpactedCell;