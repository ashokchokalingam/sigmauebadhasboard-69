
import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight, User, Monitor, FileText, Network, AlertTriangle } from "lucide-react";
import { formatDateTime } from "@/utils/dateTimeUtils";
import { Badge } from "@/components/ui/badge";

interface TimelineTableRowProps {
  log: any;
  index: number;
  isExpanded: boolean;
  onClick: () => void;
}

const TimelineTableRow = ({ log, index, isExpanded, onClick }: TimelineTableRowProps) => {
  const getRiskBadgeColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

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
      <TableCell className="whitespace-nowrap px-4 py-3 text-slate-300 text-sm">
        {formatDateTime(log.system_time || '', false)}
      </TableCell>
      <TableCell className="whitespace-nowrap px-4 py-3 text-slate-300">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-blue-400/80" />
          <span className="text-sm">{log.user_id || 'N/A'}</span>
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap px-4 py-3 text-slate-300">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-blue-400/80" />
          <span className="text-sm">{log.target_user_name || 'N/A'}</span>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 text-slate-300">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-400/80 flex-shrink-0" />
          <span className="text-sm truncate max-w-[300px]">{log.title || ''}</span>
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap px-4 py-3 text-slate-300">
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-blue-400/80" />
          <span className="text-sm">{log.computer_name || 'N/A'}</span>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 text-slate-300">
        <span className="text-sm line-clamp-1 max-w-[400px]">
          {log.description || 'N/A'}
        </span>
      </TableCell>
      <TableCell className="whitespace-nowrap px-4 py-3 text-slate-300">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-blue-400/80" />
          <code className="text-xs bg-slate-800/50 px-2 py-0.5 rounded">
            {log.ip_address || 'none'}
          </code>
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap px-4 py-3 text-slate-300">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-blue-400/80" />
          <Badge 
            variant="outline" 
            className={`${getRiskBadgeColor(log.rule_level)} px-2 py-0.5`}
          >
            {log.rule_level || 'unknown'}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap px-4 py-3">
        <Badge 
          variant="outline" 
          className="bg-green-500/10 text-green-400 border-green-500/20 px-2 py-0.5"
        >
          Low
        </Badge>
      </TableCell>
    </TableRow>
  );
};

export default TimelineTableRow;
