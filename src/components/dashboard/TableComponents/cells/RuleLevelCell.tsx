
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RuleLevelCellProps {
  level: string;
}

export const RuleLevelCell = ({ level }: RuleLevelCellProps) => {
  const getBadgeStyle = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return 'bg-[#C70039]/15 text-[#C70039] border-[#C70039]/20';
      case 'high':
        return 'bg-[#FF6F00]/10 text-[#FF6F00] border-[#FF6F00]/20';
      case 'medium':
        return 'bg-[#FFB300]/10 text-[#FFB300] border-[#FFB300]/20';
      case 'low':
        return 'bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/20';
      default:
        return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
    }
  };

  const getIconStyle = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return 'text-[#C70039]';
      case 'high':
        return 'text-[#FF6F00]';
      case 'medium':
        return 'text-[#FFB300]';
      case 'low':
        return 'text-[#4CAF50]';
      default:
        return 'text-blue-400/80';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <AlertTriangle 
        className={`h-3.5 w-3.5 flex-shrink-0 ${getIconStyle(level)}`} // Slightly smaller icon
      />
      <Badge 
        variant="outline" 
        className={`${getBadgeStyle(level)} px-3 py-1 font-medium`}
      >
        {level || 'Unknown'}
      </Badge>
    </div>
  );
};
