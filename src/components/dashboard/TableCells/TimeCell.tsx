import { TableCell } from "@/components/ui/table";
import { Clock } from "lucide-react";

interface TimeCellProps {
  time: string;
}

const TimeCell = ({ time }: TimeCellProps) => {
  const browserTime = new Date(time).toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <TableCell className="min-w-[220px] px-6">
      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-1.5 bg-slate-800/50 rounded-md">
            <Clock className="h-4 w-4 text-slate-300" />
          </div>
          <span className="text-sm font-medium text-slate-300">Time</span>
        </div>
        <p className="text-[15px] font-mono tracking-tight text-slate-200 pl-8">
          {browserTime}
        </p>
      </div>
    </TableCell>
  );
};

export default TimeCell;