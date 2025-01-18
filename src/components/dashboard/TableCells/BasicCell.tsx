import { TableCell } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BasicCellProps {
  value: React.ReactNode;
}

const BasicCell = ({ value }: BasicCellProps) => {
  const content = typeof value === 'string' ? value : 'N/A';
  
  return (
    <TableCell className="px-2 py-1.5 min-w-[120px] max-w-[200px]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 whitespace-nowrap overflow-hidden">
              <span className="text-[13px] truncate">{content}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{content}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};

export default BasicCell;