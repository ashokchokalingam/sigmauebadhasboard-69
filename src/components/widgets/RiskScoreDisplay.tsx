
import React from "react";

interface RiskScoreDisplayProps {
  score: number;
  textColor: string;
  lineColor: string;
  barWidth: number;
  glowColor: string;
  color: string;
}

const RiskScoreDisplay = ({ score, textColor, lineColor, barWidth, glowColor }: RiskScoreDisplayProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[100px] h-[4px] bg-[#1A1B23] rounded-full overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${lineColor}`}
          style={{
            width: `${barWidth}%`,
            boxShadow: `0 0 10px ${glowColor}`
          }}
        />
      </div>
      <span className={`font-mono text-base font-medium ${textColor} min-w-[60px] text-right`}>
        {score.toFixed(1)}
      </span>
    </div>
  );
};

export default RiskScoreDisplay;
