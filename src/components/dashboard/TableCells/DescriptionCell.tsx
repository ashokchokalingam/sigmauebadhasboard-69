import { AlignLeft } from "lucide-react";
import BaseTableCell from "./BaseTableCell";
import ExpandableContent from "./ExpandableContent";

interface DescriptionCellProps {
  description: string;
}

const DescriptionCell = ({ description }: DescriptionCellProps) => {
  return (
    <BaseTableCell 
      value={
        <ExpandableContent 
          content={description || '-'}
          className="text-slate-200/70"
        />
      }
      icon={AlignLeft}
      width="w-[300px]"
      tooltipContent={description}
      className="text-slate-200/70"
      align="left"
    />
  );
};

export default DescriptionCell;