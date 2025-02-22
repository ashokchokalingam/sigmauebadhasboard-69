
import React from "react";

interface RiskLevelIndicatorProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  textColor: string;
}

const RiskLevelIndicator = ({ level, textColor }: RiskLevelIndicatorProps) => {
  return (
    <span className={`text-sm font-medium tracking-wider uppercase ${textColor}`}>
      {level}
    </span>
  );
};

export default RiskLevelIndicator;
