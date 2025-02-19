
import { User } from "lucide-react";
import BaseTableCell from "./BaseTableCell";

interface UserOriginCellProps {
  userId: string;
  onTimelineView: (type: "user" | "computer", id: string) => void;
}

const UserOriginCell = ({ userId, onTimelineView }: UserOriginCellProps) => {
  return (
    <BaseTableCell 
      value={userId || '-'}
      icon={User}
      width="w-[140px]"
      onClick={(e) => {
        e.stopPropagation();
        onTimelineView("user", userId);
      }}
      tooltipContent={userId}
      align="center"
    />
  );
};

export default UserOriginCell;
