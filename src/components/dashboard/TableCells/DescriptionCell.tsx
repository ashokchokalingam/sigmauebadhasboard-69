import { AlignLeft } from "lucide-react";
import { useState } from "react";
import BaseTableCell from "./BaseTableCell";

interface DescriptionCellProps {
  description: string;
}

const DescriptionCell = ({ description }: DescriptionCellProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <BaseTableCell 
      value={
        <div 
          className={`transition-all duration-200 ease-in-out cursor-pointer
            ${isExpanded ? 'whitespace-normal line-clamp-none' : 'whitespace-nowrap line-clamp-1'}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {description || '-'}
        </div>
      }
      icon={AlignLeft}
      width="w-[300px]"
      tooltipContent={isExpanded ? undefined : description}
      className={`text-slate-200/70 transition-all duration-200 ease-in-out
        ${isExpanded ? 'max-h-[200px]' : 'max-h-[40px]'}`}
      align="left"
    />
  );
};

export default DescriptionCell;