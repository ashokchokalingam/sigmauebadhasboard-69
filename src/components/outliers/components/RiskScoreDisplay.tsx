
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
  const getScoreStyles = (score: number, severity: string) => {
    if (severity === 'critical' || score >= 150) {
      return 'from-[#FF3B30] to-[#FF453A] shadow-[0_0_15px_rgba(255,59,48,0.4)]';
    }
    if (severity === 'high' || score >= 100) {
      return 'from-[#FF9500] to-[#FF9F0A] shadow-[0_0_15px_rgba(255,149,0,0.4)]';
    }
    return 'from-[#34C759] to-[#30D158] shadow-[0_0_15px_rgba(52,199,89,0.3)]';
  };

  return (
    <div className="text-right flex items-center justify-end">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-2">
              <span className={`text-[24px] font-bold font-mono leading-none
                bg-gradient-to-r ${getScoreStyles(risk || 0, severity)} 
                bg-clip-text text-transparent tracking-tight
                ${(severity === 'critical' || severity === 'high') ? 'animate-pulse' : ''}`}>
                {risk !== null ? risk.toFixed(1) : 'N/A'}
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
