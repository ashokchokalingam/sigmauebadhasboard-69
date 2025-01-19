import { Clock } from "lucide-react";
import { format } from "date-fns";
import BaseTableCell from "./BaseTableCell";

interface TimeCellProps {
  time: string;
}

const TimeCell = ({ time }: TimeCellProps) => {
  const formattedTime = format(new Date(time), "MMM dd, yyyy, hh:mm:ss aa");
  
  return (
    <BaseTableCell 
      value={formattedTime}
      icon={Clock}
      width="w-[180px]"
      className="font-mono text-xs"
      align="left"
    />
  );
};

export default TimeCell;