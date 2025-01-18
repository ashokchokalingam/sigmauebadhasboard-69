import { TableCell } from "@/components/ui/table";
import { User } from "lucide-react";

interface UserImpactedCellProps {
  userName: string;
}

const UserImpactedCell = ({ userName }: UserImpactedCellProps) => {
  return (
    <TableCell className="px-6">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-slate-400" />
        <span>{userName || '-'}</span>
      </div>
    </TableCell>
  );
};

export default UserImpactedCell;