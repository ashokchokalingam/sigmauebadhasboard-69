
import { Monitor, FileText, AlignLeft } from "lucide-react";
import { format } from "date-fns";
import { Alert } from "../types";

interface TableCellProps {
  alert: Alert;
  columnKey: string;
  onTimelineView: (type: "user" | "computer", id: string) => void;
}

const TableCell = ({ alert, columnKey, onTimelineView }: TableCellProps) => {
  switch (columnKey) {
    case 'system_time':
      return (
        <span className="font-medium">
          {format(new Date(alert.system_time), "MMM dd, yyyy, HH:mm:ss")}
        </span>
      );
    case 'user_id':
      return (
        <div className="flex items-center">
          <span className="truncate font-medium">
            {alert.user_id || '-'}
          </span>
        </div>
      );
    case 'target_user_name':
      return (
        <div className="flex items-center">
          <span className="truncate font-medium">
            {alert.target_user_name || '-'}
          </span>
        </div>
      );
    case 'computer_name':
      return (
        <div className="flex items-center">
          <Monitor className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span 
            className="hover:text-blue-400 cursor-pointer truncate font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onTimelineView("computer", alert.computer_name || '');
            }}
          >
            {alert.computer_name || '-'}
          </span>
        </div>
      );
    case 'title':
      return (
        <div className="flex items-center">
          <FileText className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate font-medium">{alert.title}</span>
        </div>
      );
    case 'description':
      return (
        <div className="flex items-center">
          <AlignLeft className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
          <span className="truncate">{alert.description}</span>
        </div>
      );
    default:
      return (
        <span className="font-medium">
          {String(alert[columnKey as keyof Alert] || '-')}
        </span>
      );
  }
};

export default TableCell;
