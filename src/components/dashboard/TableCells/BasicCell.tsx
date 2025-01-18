import { TableCell } from "@/components/ui/table";
import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BasicCellProps {
  value: string | number | ReactNode;
}

const BasicCell = ({ value }: BasicCellProps) => {
  const content = typeof value === 'string' || typeof value === 'number' ? value : null;
  
  return (
    <TableCell className="px-3 py-2 w-[150px] flex-shrink-0">
      {content ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-[13px] truncate block text-center">{value}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{String(content)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <span className="text-[13px] truncate block text-center">{value}</span>
      )}
    </TableCell>
  );
};

export default BasicCell;