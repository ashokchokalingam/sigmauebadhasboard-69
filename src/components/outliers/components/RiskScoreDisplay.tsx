
import { Info } from "lucide-react";
import { getRiskScoreColor } from "../utils/colorUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RiskScoreDisplayProps {
  risk: number | null;
  severity: string;
}

export const RiskScoreDisplay = ({ risk, severity }: RiskScoreDisplayProps) => {
  return (
    <div className="text-right flex items-center justify-end">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-1.5">
              <span className={`text-[19px] font-bold bg-gradient-to-r ${getRiskScoreColor(severity)} 
                bg-clip-text text-transparent leading-none`}>
                {risk || 'N/A'}
              </span>
              <Info className="w-4 h-4 text-purple-400/70" />
            </div>
          </TooltipTrigger>
          <TooltipContent 
            className="bg-black/90 border-purple-500/20 text-purple-100 text-[13px] max-w-[200px]"
          >
            Risk score calculation based on severity, impact, and historical patterns
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
