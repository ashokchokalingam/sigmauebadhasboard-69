import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { Alert } from "./types";
import { format } from "date-fns";
import { extractTacticsAndTechniques } from "./utils";

interface TimelineLogCardProps {
  log: Alert;
  isExpanded: boolean;
  onToggleExpand: (log: Alert) => void;
  visibleColumns: string[];
}

const TimelineLogCard = ({ log, isExpanded, onToggleExpand, visibleColumns }: TimelineLogCardProps) => {
  const formattedTime = format(new Date(log.system_time), "MMM d, yyyy hh:mm:ss aa");
  const { tactics, techniques } = extractTacticsAndTechniques(log.tags);

  const handleRowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(log);
  };

  return (
    <TableRow 
      className={`hover:bg-purple-400/5 cursor-pointer ${isExpanded ? 'bg-purple-400/10' : ''}`}
      onClick={handleRowClick}
    >
      <TableCell className="w-[180px] font-mono text-purple-200/90 text-sm whitespace-nowrap">
        {formattedTime}
      </TableCell>
      <TableCell className="w-[120px] text-purple-200/90">
        {log.user_id || 'N/A'}
      </TableCell>
      <TableCell className="w-[120px] text-purple-200/90">
        {log.target_user_name || 'N/A'}
      </TableCell>
      <TableCell className="w-[140px] text-purple-200/90">
        {log.computer_name}
      </TableCell>
      <TableCell className="min-w-[200px] text-purple-200/90">
        <div className="flex flex-col">
          <span className="font-medium">{log.title}</span>
          <span className="text-sm text-purple-200/70 line-clamp-1">
            {log.description}
          </span>
        </div>
      </TableCell>
      <TableCell className="w-[200px]">
        <div className="flex flex-wrap gap-1">
          {tactics?.split(',').map((tactic, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs rounded-full bg-purple-400/10 text-purple-200/90"
            >
              {tactic.trim()}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell className="w-[200px]">
        <div className="flex flex-wrap gap-1">
          {techniques.map((technique, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-300"
            >
              {technique}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell className="w-[50px]">
        <ChevronRight 
          className={`h-4 w-4 text-purple-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
        />
      </TableCell>
    </TableRow>
  );
};

export default TimelineLogCard;