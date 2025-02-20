
import { LucideIcon } from "lucide-react";

interface BaseIconCellProps {
  icon: LucideIcon;
  text: string;
  className?: string;
  isBold?: boolean;
}

export const BaseIconCell = ({ icon: Icon, text, className = "", isBold = false }: BaseIconCellProps) => (
  <div className="flex items-center min-w-0">
    <Icon className="h-4 w-4 text-blue-400/80 mr-2 flex-shrink-0" />
    <span className={`truncate text-base whitespace-nowrap ${isBold ? 'font-medium' : ''} ${className}`}>
      {text || '-'}
    </span>
  </div>
);
