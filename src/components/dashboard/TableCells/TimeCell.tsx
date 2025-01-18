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
    <TableCell className="px-6">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-slate-400" />
        <span className="font-mono">{browserTime}</span>
      </div>
    </TableCell>
  );
};

export default TimeCell;