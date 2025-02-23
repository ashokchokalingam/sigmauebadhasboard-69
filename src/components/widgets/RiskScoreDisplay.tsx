
import { memo } from "react";
import { Shield } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RiskScoreDisplayProps {
  score: number;
  textColor: string;
}

const RiskScoreDisplay = memo(({ score, textColor }: RiskScoreDisplayProps) => {
  const getScoreStyles = (score: number) => {
    const baseGradient = "bg-gradient-to-r bg-clip-text text-transparent";
    
    if (score >= 150) {
      return `${baseGradient} from-[#FF3B30] to-[#FF453A] shadow-[0_0_15px_rgba(255,59,48,0.4)] animate-pulse`;
    }
    if (score >= 100) {
      return `${baseGradient} from-[#FF9500] to-[#FF9F0A] shadow-[0_0_15px_rgba(255,149,0,0.4)] animate-pulse`;
    }
    if (score >= 50) {
      return `${baseGradient} from-[#FFB340] to-[#FFB236]`;
    }
    return `${baseGradient} from-[#34C759] to-[#30D158]`;
  };

  const getShieldStyles = (score: number) => {
    if (score >= 150) return "text-[#FF3B30]";
    if (score >= 100) return "text-[#FF9500]";
    if (score >= 50) return "text-[#FFB340]";
    return "text-[#34C759]";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 150) return "Critical risk level - Immediate attention required";
    if (score >= 100) return "High risk level - Urgent investigation needed";
    if (score >= 50) return "Medium risk level - Monitor closely";
    return "Low risk level - Normal activity";
  };

  // Remove leading zeros by using Math.floor for the whole number part
  const formatScore = (score: number) => {
    const wholeNumber = Math.floor(score);
    const decimal = score - wholeNumber;
    return wholeNumber + (decimal ? decimal.toFixed(1).substring(1) : '');
  };

  return (
    <div className="relative flex items-center gap-1.5">
      <div className="flex flex-col items-end">
        <span className="text-[11px] uppercase text-[#9b87f5]/60 tracking-wide mb-0.5">
          Risk Score
        </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Shield 
                  className={`w-5 h-5 transition-all stroke-[2.5] ${getShieldStyles(score)}`}
                />
                <div className={`text-[24px] font-mono font-bold tracking-tight ${getScoreStyles(score)}`}>
                  {formatScore(score)}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent
              className="bg-[#0A0B0F]/90 border border-[#5856D6]/20 backdrop-blur-xl"
            >
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#D6BCFA]">
                  Risk Score: {formatScore(score)}
                </p>
                <p className="text-xs text-[#9b87f5]">
                  {getScoreDescription(score)}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
});

RiskScoreDisplay.displayName = 'RiskScoreDisplay';

export default RiskScoreDisplay;
