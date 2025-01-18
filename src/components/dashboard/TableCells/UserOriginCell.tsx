import { TableCell } from "@/components/ui/table";
import { User } from "lucide-react";

interface UserOriginCellProps {
  userId: string;
  onTimelineView: (type: "user" | "computer", id: string) => void;
}

const UserOriginCell = ({ userId, onTimelineView }: UserOriginCellProps) => {
  return (
    <TableCell className="min-w-[220px] px-6">
      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:bg-slate-900/70 transition-all shadow-sm">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-1.5 bg-slate-800/50 rounded-md">
            <User className="h-4 w-4 text-slate-300" />
          </div>
          <span className="text-sm font-medium text-slate-300">User Origin</span>
        </div>
        <p 
          className="text-[15px] font-mono tracking-tight text-slate-200 hover:text-blue-400 transition-colors cursor-pointer pl-8"
          onClick={(e) => {
            e.stopPropagation();
            onTimelineView("user", userId || '');
          }}
        >
          {userId || 'N/A'}
        </p>
      </div>
    </TableCell>
  );
};

export default UserOriginCell;