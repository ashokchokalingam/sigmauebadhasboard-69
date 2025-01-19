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
      {Icon && <Icon className="h-4 w-4 text-blue-400/70 flex-shrink-0" />}
      <span className="text-[13px] font-medium text-slate-200/90">{value}</span>
    </div>
  );

  const cell = (
    <TableCell 
      className={`px-4 py-2 border-b border-blue-900/10 ${width} ${className} 
      ${onClick ? 'cursor-pointer hover:bg-blue-950/30 transition-colors' : ''}`}
      onClick={onClick}
      style={{
        ...style,
        maxWidth: width,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
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
            className="max-w-[400px] break-words bg-[#0A0D14] border border-blue-900/20"
          >
            <p className="text-sm text-slate-200/90">{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cell;
};

export default BaseTableCell;