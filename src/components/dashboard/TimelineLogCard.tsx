import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { Alert } from "./types";
import { format } from "date-fns";

interface TimelineLogCardProps {
  log: Alert;
  isExpanded: boolean;
  onToggleExpand: () => void;
  visibleColumns: string[];
}

const TimelineLogCard = ({ log, isExpanded, onToggleExpand }: TimelineLogCardProps) => {
  const formattedTime = format(new Date(log.system_time), "MMM d, yyyy hh:mm:ss aa");

  return (
    <TableRow 
      className={`hover:bg-purple-400/5 cursor-pointer ${isExpanded ? 'bg-purple-400/10' : ''}`}
      onClick={onToggleExpand}
    >
      <TableCell className="w-[180px] font-mono text-purple-200/90 text-base whitespace-nowrap">
        {formattedTime}
      </TableCell>
      <TableCell className="w-[120px] text-purple-200/90 text-base">
        {log.user_id || 'N/A'}
      </TableCell>
      <TableCell className="w-[120px] text-purple-200/90 text-base">
        {log.target_user_name || 'N/A'}
      </TableCell>
      <TableCell className="w-[140px] text-purple-200/90 text-base">
        {log.computer_name || 'N/A'}
      </TableCell>
      <TableCell className="min-w-[200px] text-purple-200/90">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-base">{log.title}</span>
          <span className="text-sm text-purple-200/70 line-clamp-2">
            {log.description}
          </span>
        </div>
      </TableCell>
      <TableCell className="w-[200px]">
        <div className="flex flex-wrap gap-1.5">
          {log.tactics?.split(',').map((tactic, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm rounded-full bg-purple-400/10 text-purple-200/90"
            >
              {tactic.trim()}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell className="w-[50px]">
        <ChevronRight 
          className={`h-5 w-5 text-purple-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
        />
      </TableCell>
    </TableRow>
  );
};

export default TimelineLogCard;