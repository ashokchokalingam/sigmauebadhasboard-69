import { Clock } from "lucide-react";
import { format } from "date-fns";
import BaseTableCell from "./BaseTableCell";

interface TimeCellProps {
  time: string;
}

const TimeCell = ({ time }: TimeCellProps) => {
  const browserTime = format(new Date(time), "MMM dd, yyyy, hh:mm:ss aa", {
    useAdditionalWeekYearTokens: true,
    useAdditionalDayOfYearTokens: true,
  });

  return (
    <BaseTableCell 
      value={browserTime}
      icon={Clock}
      width="w-[160px]"
      className="font-mono"
      align="left"
    />
  );
};

export default TimeCell;