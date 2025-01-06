import { TableCell, TableRow } from "@/components/ui/table";
import { Alert } from "./types";
import { ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface TimelineLogCardProps {
  log: Alert;
  isExpanded: boolean;
  onToggleExpand: (log: Alert) => void;
  visibleColumns: string[];
}

const TimelineLogCard = ({ log, isExpanded, onToggleExpand, visibleColumns }: TimelineLogCardProps) => {
  const formattedTime = format(new Date(log.system_time), "MMM d, yyyy hh:mm:ss aa");

  const handleRowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(log);
  };

  return (
    <TableRow 
      className={`group hover:bg-purple-400/5 cursor-pointer transition-all duration-200 ${
        isExpanded ? 'bg-purple-400/10 border-l-2 border-l-purple-400' : ''
      }`}
      onClick={handleRowClick}
    >
      <TableCell className="w-[180px] font-mono text-purple-200/90 text-sm whitespace-nowrap">
        {formattedTime}
      </TableCell>
      <TableCell className="w-[120px] text-purple-200/90">
        {log.user_id || 'N/A'}
      </TableCell>
      <TableCell className="w-[120px] text-purple-200/90">
        <span className="font-mono bg-purple-400/10 px-2 py-1 rounded text-xs">
          {log.target_user_name || 'N/A'}
        </span>
      </TableCell>
      <TableCell className="w-[140px] text-purple-200/90">
        <span className="font-mono bg-blue-400/10 px-2 py-1 rounded text-xs">
          {log.computer_name}
        </span>
      </TableCell>
      <TableCell className="min-w-[200px] text-purple-200/90">
        <div className="flex flex-col">
          <span className="font-medium text-blue-300">{log.title}</span>
          <span className="text-sm text-purple-200/70 line-clamp-1">
            {log.description}
          </span>
        </div>
      </TableCell>
      <TableCell className="w-[200px]">
        <div className="flex flex-wrap gap-1">
          {log.tags.split(',').map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs rounded-full bg-purple-400/10 text-purple-200/90 border border-purple-400/20"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell className="w-[50px]">
        <ChevronRight 
          className={`h-4 w-4 text-purple-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-90' : 'group-hover:translate-x-1'
          }`}
        />
      </TableCell>
    </TableRow>
  );
};

export default TimelineLogCard;