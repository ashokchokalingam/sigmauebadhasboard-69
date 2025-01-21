import { AlignLeft } from "lucide-react";
import BaseTableCell from "./BaseTableCell";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DescriptionCellProps {
  description: string;
}

const DescriptionCell = ({ description }: DescriptionCellProps) => {
  const truncatedDescription = description?.length > 100 
    ? `${description.substring(0, 100)}...` 
    : description || '-';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <BaseTableCell 
              value={truncatedDescription}
              icon={AlignLeft}
              width="w-[300px]"
              className="text-slate-200/70"
              align="left"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-[400px] break-words bg-[#0A0D14] border border-blue-900/20"
        >
          <p className="text-sm text-slate-200/90 whitespace-pre-wrap">
            {description}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DescriptionCell;