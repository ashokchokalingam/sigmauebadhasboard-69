
import { memo } from "react";
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
    const baseClasses = "font-mono font-bold tabular-nums transition-all min-w-[60px] text-right";
    
    if (score >= 150) {
      return `${baseClasses} text-[24px] text-[#FF3B30] drop-shadow-[0_0_8px_rgba(255,59,48,0.5)]`;
    }
    if (score >= 100) {
      return `${baseClasses} text-[22px] ${textColor} drop-shadow-[0_0_6px_rgba(255,149,0,0.5)]`;
    }
    return `${baseClasses} text-[20px] ${textColor}`;
  };

  return (
    <div className="relative pl-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={getScoreClasses(score)}>
              {score.toFixed(1)}
            </div>
          </TooltipTrigger>
          <TooltipContent
            className="bg-[#0A0B0F]/90 border border-[#5856D6]/20 backdrop-blur-xl"
          >
            <p className="text-xs text-[#D6BCFA]">
              Risk Score: {score.toFixed(1)}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});

RiskScoreDisplay.displayName = 'RiskScoreDisplay';

export default RiskScoreDisplay;
