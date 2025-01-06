import { TableCell, TableRow } from "@/components/ui/table";
import { Alert } from "./types";
import { extractTacticsAndTechniques } from "./utils";

interface TimelineLogCardProps {
  log: Alert;
  isExpanded: boolean;
  onToggleExpand: (log: Alert) => void;
  visibleColumns: string[];
}

const TimelineLogCard = ({ log, isExpanded, onToggleExpand, visibleColumns }: TimelineLogCardProps) => {
  const { tactics, techniques } = extractTacticsAndTechniques(log.tags);
  
  const browserTime = new Date(log.system_time).toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <TableRow 
      className={`hover:bg-purple-950/30 cursor-pointer ${isExpanded ? 'bg-purple-950/20' : ''}`}
      onClick={() => onToggleExpand(log)}
    >
      <TableCell className="font-mono text-purple-300 text-sm whitespace-nowrap">
        {browserTime}
      </TableCell>
      <TableCell className="text-purple-100">
        {log.user_id || 'N/A'}
      </TableCell>
      <TableCell className="text-purple-100">
        {log.target_user_name || 'N/A'}
      </TableCell>
      <TableCell className="text-purple-100">
        {log.computer_name || 'N/A'}
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <p className="text-purple-100">{log.title}</p>
          <p className="text-sm text-purple-300/70">{log.description}</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <div>
            <span className="text-xs text-purple-400">MITRE ATT&CK Tactics</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {tactics?.split(',').map((tactic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[#9b87f5]/10 text-[#9b87f5] text-xs rounded-full border border-[#9b87f5]/20"
                >
                  {tactic.trim()}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs text-purple-400">MITRE ATT&CK Techniques</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {techniques.map((technique, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[#F97316]/10 text-[#F97316] text-xs rounded-full border border-[#F97316]/20"
                >
                  {technique}
                </span>
              ))}
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TimelineLogCard;