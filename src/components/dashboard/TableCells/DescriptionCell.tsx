import { TableCell } from "@/components/ui/table";
import { AlignLeft } from "lucide-react";
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
  return (
    <TableCell className="px-3 py-2 flex-1 min-w-[200px]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
              <AlignLeft className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
              <span className="text-[13px] text-slate-200/70 truncate text-left">
                {description || '-'}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};

export default DescriptionCell;