
import { memo } from "react";

interface RiskLevelIndicatorProps {
  level: string;
  textColor: string;
}

const RiskLevelIndicator = memo(({ level, textColor }: RiskLevelIndicatorProps) => {
  return (
    <div className="flex flex-col items-start w-[90px]">
      <span className="text-xs uppercase text-[#9b87f5]/70 mb-0.5">Risk Level</span>
      <div className="w-full">
        <span className={`text-sm font-medium tracking-wider uppercase ${textColor}`}>
          {level}
        </span>
      </div>
    </div>
  );
});

RiskLevelIndicator.displayName = 'RiskLevelIndicator';

export default RiskLevelIndicator;
