
interface RiskLevelResult {
  level: string;
  color: string;
  textColor: string;
  bgColor: string;
  lineColor: string;
  barWidth: number;
  glowColor: string;
}

export const getRiskLevel = (score: number): RiskLevelResult => {
  // Calculate relative width based on risk level
  const getBarWidth = (score: number): number => {
    if (score >= 150) return Math.min((score / 200) * 100, 100); // CRITICAL
    if (score >= 100) return (score / 150) * 75; // HIGH
    if (score >= 50) return (score / 100) * 50; // MEDIUM
    return (score / 50) * 25; // LOW
  };

  if (score >= 150) return { 
    level: "CRITICAL", 
    color: "#FF3B30", // Brighter red for critical
    textColor: "text-[#FF3B30]",
    bgColor: "bg-[#FF3B30]/10",
    lineColor: "bg-[#FF3B30]",
    barWidth: getBarWidth(score),
    glowColor: "#FF5252"
  };
  if (score >= 100) return { 
    level: "HIGH", 
    color: "#FF9500", // Warmer orange for high
    textColor: "text-[#FF9500]",
    bgColor: "bg-[#FF9500]/10",
    lineColor: "bg-[#FF9500]",
    barWidth: getBarWidth(score),
    glowColor: "#FFB340"
  };
  if (score >= 50) return { 
    level: "MEDIUM", 
    color: "#FFB340", // More distinct amber for medium
    textColor: "text-[#FFB340]",
    bgColor: "bg-[#FFB340]/10",
    lineColor: "bg-[#FFB340]",
    barWidth: getBarWidth(score),
    glowColor: "#FFD484"
  };
  return { 
    level: "LOW", 
    color: "#34C759", // Brighter green for low
    textColor: "text-[#34C759]",
    bgColor: "bg-[#34C759]/10",
    lineColor: "bg-[#34C759]",
    barWidth: getBarWidth(score),
    glowColor: "#4ADE80"
  };
};
