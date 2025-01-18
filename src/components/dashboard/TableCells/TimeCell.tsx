import { TableCell } from "@/components/ui/table";
import { Clock } from "lucide-react";
import { format } from "date-fns";

interface TimeCellProps {
  time: string;
}

const TimeCell = ({ time }: TimeCellProps) => {
  const browserTime = format(new Date(time), "MMM dd, yyyy, hh:mm:ss aa", {
    useAdditionalWeekYearTokens: true,
    useAdditionalDayOfYearTokens: true,
  });

  return (
    <TableCell className="px-3 py-2 w-[120px] flex-shrink-0">
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
        <span className="font-mono text-[13px] truncate text-left">{browserTime}</span>
      </div>
    </TableCell>
  );
};

export default TimeCell;