import { TableCell } from "@/components/ui/table";
import { User } from "lucide-react";

interface UserImpactedCellProps {
  userName: string;
}

const UserImpactedCell = ({ userName }: UserImpactedCellProps) => {
  return (
    <TableCell className="px-2 py-0 w-[180px] flex-shrink-0">
      <div className="flex items-center gap-1">
        <User className="h-3.5 w-3.5 text-slate-400" />
        <span className="truncate">{userName || '-'}</span>
      </div>
    </TableCell>
  );
};

export default UserImpactedCell;