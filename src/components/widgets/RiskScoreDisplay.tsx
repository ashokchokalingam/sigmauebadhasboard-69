
import { memo } from "react";
import RiskScoreExplanation from "@/components/dashboard/RiskScoreExplanation";

interface RiskScoreDisplayProps {
  score: number;
  textColor: string;
  lineColor: string;
  barWidth: number;
  glowColor: string;
  color: string;
  tactics?: string[];
  techniques?: string[];
}

const RiskScoreDisplay = memo(({ 
  score, 
  textColor, 
  lineColor, 
  barWidth, 
  glowColor,
  color,
  tactics = [],
  techniques = []
}: RiskScoreDisplayProps) => {
  return (
    <div className="relative min-w-[140px]">
      <div className="flex items-center justify-end gap-1 mb-1">
        <div className={`font-mono font-bold text-2xl tabular-nums ${textColor}`}>
          <RiskScoreExplanation 
            score={score}
            tactics={tactics}
            techniques={techniques}
          />
        </div>
      </div>
      
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
