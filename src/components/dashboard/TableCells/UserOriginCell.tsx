import { TableCell } from "@/components/ui/table";
import { User } from "lucide-react";

interface UserOriginCellProps {
  userId: string;
  onTimelineView: (type: "user" | "computer", id: string) => void;
}

const UserOriginCell = ({ userId, onTimelineView }: UserOriginCellProps) => {
  return (
    <TableCell 
      className="px-3 py-2 w-[180px] flex-shrink-0 cursor-pointer hover:text-blue-400 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onTimelineView("user", userId);
      }}
    >
      <div className="flex items-center gap-1.5">
        <User className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
        <span className="truncate text-center">{userId || '-'}</span>
      </div>
    </TableCell>
  );
};

export default UserOriginCell;