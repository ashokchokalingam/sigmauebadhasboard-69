
import React from "react";
import EntityInfo from "./EntityInfo";
import RiskIndicators from "./RiskIndicators";
import { getRiskLevel } from "./utils/riskLevelUtils";

interface EntityCardProps {
  id: string;
  eventCount: number;
  uniqueTitles: number;
  riskScore: string | null;
  onClick: () => void;
}

const EntityCard = ({ id, eventCount, uniqueTitles, riskScore, onClick }: EntityCardProps) => {
  const score = riskScore ? parseFloat(riskScore) : 0;
  const {
    level,
    color,
    textColor,
    bgColor,
    lineColor,
    barWidth,
    glowColor
  } = getRiskLevel(score);

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3 rounded-lg
        bg-[#0A0B0F] hover:bg-[#12131A]
        border border-[#5856D6]/20 hover:border-[#5856D6]/30
        transition-all duration-300 cursor-pointer
        hover:shadow-lg hover:shadow-[#5856D6]/5"
    >
      <EntityInfo
        entityName={id}
        isComputer={false}
        uniqueTitleCount={uniqueTitles}
        textColor={textColor}
        bgColor={bgColor}
      />

      <RiskIndicators
        level={level}
        color={color}
        textColor={textColor}
        lineColor={lineColor}
        barWidth={barWidth}
        glowColor={glowColor}
        riskScore={score}
      />
    </div>
  );
};

export default EntityCard;

