import { TableCell } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";

interface BaseCellProps {
  value: React.ReactNode;
  icon?: LucideIcon;
  width?: string;
  onClick?: (e: React.MouseEvent) => void;
  tooltipContent?: string;
  className?: string;
}

const BaseTableCell = ({ 
  value, 
  icon: Icon, 
  width = "min-w-[120px]",
  onClick,
  tooltipContent,
  className = ""
}: BaseCellProps) => {
  const content = (
    <div className="flex items-center gap-1 whitespace-nowrap overflow-hidden">
      {Icon && <Icon className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />}
      <span className="text-[13px] truncate">{value}</span>
    </div>
  );

  const cell = (
    <TableCell 
      className={`px-2 py-1.5 ${width} ${className} ${onClick ? 'cursor-pointer hover:text-blue-400 transition-colors' : ''}`}
      onClick={onClick}
    >
      {content}
    </TableCell>
  );

  if (tooltipContent) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {cell}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cell;
};

export default BaseTableCell;