import { TableCell } from "@/components/ui/table";
import { User } from "lucide-react";

interface UserOriginCellProps {
  userId: string;
  onTimelineView: (type: "user" | "computer", id: string) => void;
}

const UserOriginCell = ({ userId, onTimelineView }: UserOriginCellProps) => {
  return (
    <TableCell 
      className="px-6 cursor-pointer hover:text-blue-400 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onTimelineView("user", userId);
      }}
    >
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-slate-400" />
        <span>{userId || '-'}</span>
      </div>
    </TableCell>
  );
};

export default UserOriginCell;