import { AlignLeft } from "lucide-react";
import BaseTableCell from "./BaseTableCell";

interface DescriptionCellProps {
  description: string;
}

const DescriptionCell = ({ description }: DescriptionCellProps) => {
  return (
    <BaseTableCell 
      value={description || '-'}
      icon={AlignLeft}
      width="min-w-[180px] max-w-[300px]"
      tooltipContent={description}
      className="text-slate-200/70"
    />
  );
};

export default DescriptionCell;