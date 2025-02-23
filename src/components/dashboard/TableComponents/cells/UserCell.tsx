
import { User } from "lucide-react";

interface UserCellProps {
  userId: string;
  onTimelineView: (type: "user" | "computer", id: string) => void;
}

export const UserCell = ({ userId, onTimelineView }: UserCellProps) => (
  <div className="flex items-center min-w-0">
    <User className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
    <span 
      className="hover:text-blue-400 cursor-pointer truncate text-base font-medium whitespace-nowrap"
      onClick={(e) => {
        e.stopPropagation();
        onTimelineView("user", userId);
      }}
    >
      {userId || '-'}
    </span>
  </div>
);
