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
  align?: "left" | "center" | "right";
  style?: React.CSSProperties;
}

const BaseTableCell = ({ 
  value, 
  icon: Icon, 
  width = "min-w-[120px]",
  onClick,
  tooltipContent,
  className = "",
  align = "left",
  style
}: BaseCellProps) => {
  const content = (
    <div className={`flex items-center gap-2 ${
      align === "center" ? "justify-center" : 
      align === "right" ? "justify-end" : "justify-start"
    }`}>
      {Icon && <Icon className="h-4 w-4 text-purple-400/70 flex-shrink-0" />}
      <span className="text-[13px] truncate font-medium text-purple-100/90">{value}</span>
    </div>
  );

  const cell = (
    <TableCell 
      className={`px-3 py-2.5 border-b border-purple-900/10 ${width} ${className} 
      ${onClick ? 'cursor-pointer hover:bg-purple-500/5 transition-colors' : ''}`}
      onClick={onClick}
      style={{
        ...style,
        maxWidth: width,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        backgroundColor: 'rgb(26, 31, 44)'
      }}
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
          <TooltipContent 
            side="top" 
            className="max-w-[400px] break-words bg-[#1A1F2C] border border-purple-900/20"
          >
            <p className="text-sm text-purple-100/90">{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cell;
};

export default BaseTableCell;