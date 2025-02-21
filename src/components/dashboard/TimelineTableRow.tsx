
import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatDateTime } from "@/utils/dateTimeUtils";

interface TimelineTableRowProps {
  log: any;
  index: number;
  isExpanded: boolean;
  onClick: () => void;
}

const TimelineTableRow = ({ log, index, isExpanded, onClick }: TimelineTableRowProps) => {
  return (
    <TableRow 
      key={`row-${index}`}
      className={`border-b border-indigo-500/10 cursor-pointer transition-colors duration-150
        ${isExpanded ? 'bg-indigo-500/5' : 'hover:bg-indigo-500/5'}`}
      onClick={onClick}
    >
      <TableCell className="w-8 text-center">
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-indigo-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-400" />
        )}
      </TableCell>
      <TableCell className="whitespace-nowrap px-4 py-3 text-slate-300 font-medium">
        {formatDateTime(log.system_time || '', false)}
      </TableCell>
      <TableCell className="whitespace-nowrap px-4 py-3 text-slate-300">
        {log.event_id || 'N/A'}
      </TableCell>
      <TableCell className="whitespace-nowrap px-4 py-3 text-slate-300">
        {log.title || ''}
      </TableCell>
      <TableCell className="whitespace-nowrap px-4 py-3 text-slate-300">
        {log.computer_name || 'N/A'}
      </TableCell>
      <TableCell className="whitespace-nowrap px-4 py-3 text-slate-300">
        {log.provider_name || 'N/A'}
      </TableCell>
      <TableCell className="whitespace-nowrap px-4 py-3 text-slate-300">
        {log.rule_level || 'N/A'}
      </TableCell>
    </TableRow>
  );
};

export default TimelineTableRow;
