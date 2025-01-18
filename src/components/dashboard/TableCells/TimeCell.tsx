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
    <TableCell className="px-3 py-0">
      <div className="flex items-center gap-2">
        <Clock className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-mono text-[13px]">{browserTime}</span>
      </div>
    </TableCell>
  );
};

export default TimeCell;