
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
  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`font-mono font-bold text-[20px] tabular-nums ${textColor}`}>
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
