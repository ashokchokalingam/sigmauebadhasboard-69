
import { Alert } from "../types";
import { cn } from "@/lib/utils";
import { formatTimestamp, getRiskLevelColor, getRiskScoreColor } from "./utils";

interface ChronoAnalyzerTableRowProps {
  event: Alert;
}

export const ChronoAnalyzerTableRow = ({ event }: ChronoAnalyzerTableRowProps) => {
  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-800/50 hover:bg-slate-800/20">
      <div className="col-span-1 text-sm text-slate-300">
        {formatTimestamp(event.system_time)}
      </div>
      <div className="col-span-1 text-sm text-slate-300">
        {event.user_origin || 'N/A'}
      </div>
      <div className="col-span-1 text-sm text-slate-300">
        {event.target_user_name || 'none'}
      </div>
      <div className="col-span-2 text-sm text-slate-300">
        {event.title}
      </div>
      <div className="col-span-2 text-sm text-slate-300">
        {event.computer_name || 'N/A'}
      </div>
      <div className="col-span-2 text-sm text-slate-300 truncate">
        {event.description}
      </div>
      <div className="col-span-1 text-sm text-slate-300">
        {event.ip_address || 'none'}
      </div>
      <div className="col-span-1">
        <span className={cn("text-sm font-medium", getRiskLevelColor(event.rule_level))}>
          {event.rule_level || 'unknown'}
        </span>
      </div>
      <div className="col-span-1">
        <span className={cn("text-sm font-medium", getRiskScoreColor(event.risk || 0))}>
          {event.risk || 'Low'}
        </span>
      </div>
    </div>
  );
};
