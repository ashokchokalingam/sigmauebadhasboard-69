
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
  lineColor: string;
  barWidth: number;
  glowColor: string;
  color: string;
}

const RiskScoreDisplay = memo(({ 
  score, 
  textColor, 
  lineColor, 
  barWidth, 
  glowColor,
  color 
}: RiskScoreDisplayProps) => {
  return (
    <div className="relative min-w-[140px]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-end gap-1 mb-1">
              <div className={`font-mono font-bold text-[20px] tabular-nums ${textColor}`}>
                {score.toFixed(1)}
              </div>
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
      
      <div className="relative h-2 bg-[#5856D6]/10 rounded-full overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="flex-1 border-r border-[#5856D6]/20" />
          <div className="flex-1 border-r border-[#5856D6]/20" />
          <div className="flex-1 border-r border-[#5856D6]/20" />
          <div className="flex-1" />
        </div>
        
        <div 
          className={`h-full ${lineColor} transition-all duration-300`}
          style={{ 
            width: `${barWidth}%`,
            boxShadow: `0 0 10px ${glowColor}, 0 0 15px ${color}40`
          }}
        />
      </div>
    </div>
  );
});

RiskScoreDisplay.displayName = 'RiskScoreDisplay';

export default RiskScoreDisplay;

