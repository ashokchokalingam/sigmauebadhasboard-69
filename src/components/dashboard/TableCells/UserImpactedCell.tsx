import { UserCheck } from "lucide-react";
import BaseTableCell from "./BaseTableCell";

interface UserImpactedCellProps {
  userName: string;
}

const UserImpactedCell = ({ userName }: UserImpactedCellProps) => {
  return (
    <BaseTableCell 
      value={userName || '-'}
      icon={UserCheck}
      width="w-[120px]"
      tooltipContent={userName}
    />
  );
};

export default UserImpactedCell;