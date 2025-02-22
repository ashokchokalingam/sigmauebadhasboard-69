
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
  const getScoreClasses = (score: number) => {
    const baseClasses = "font-mono font-bold tabular-nums transition-all leading-none";
    
    if (score >= 150) {
      return `${baseClasses} text-[22px] text-[#FF3B30] drop-shadow-[0_0_12px_rgba(255,59,48,0.6)]`;
    }
    if (score >= 100) {
      return `${baseClasses} text-[22px] text-[#FF9500] drop-shadow-[0_0_6px_rgba(255,149,0,0.5)]`;
    }
    if (score >= 50) {
      return `${baseClasses} text-[20px] text-[#FFB340]`;
    }
    return `${baseClasses} text-[20px] text-[#34C759]`;
  };

  const getShieldStyles = (score: number) => {
    if (score >= 150) {
      return "text-[#FF3B30] drop-shadow-[0_0_8px_rgba(255,59,48,0.4)]";
    }
    if (score >= 100) {
      return "text-[#FF9500] drop-shadow-[0_0_6px_rgba(255,149,0,0.3)]";
    }
    if (score >= 50) {
      return "text-[#FFB340]";
    }
    return "text-[#34C759]";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 150) return "Critical risk level - Immediate attention required";
    if (score >= 100) return "High risk level - Urgent investigation needed";
    if (score >= 50) return "Medium risk level - Monitor closely";
    return "Low risk level - Normal activity";
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
              <div className="flex items-center gap-1.5">
                <Shield 
                  className={`w-4 h-4 transition-all stroke-[2.5] ${getShieldStyles(score)}`}
                />
                <div className={getScoreClasses(score)}>
                  {score.toFixed(1)}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent
              className="bg-[#0A0B0F]/90 border border-[#5856D6]/20 backdrop-blur-xl"
            >
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#D6BCFA]">
                  Risk Score: {score.toFixed(1)}
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
